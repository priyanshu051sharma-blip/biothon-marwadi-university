import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Activity, 
  Clock, 
  Calendar, 
  FileText, 
  Bell, 
  AlertCircle, 
  CheckCircle,
  Thermometer,
  User
} from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientDashboard() {
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState(null)
  const [activeQueueStatus, setActiveQueueStatus] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // Default patient for demo is Sarah Miller (P002)
    fetchPatientData()
    fetchQueueStatus()
    loadNotifications()
    loadAppointments()
  }, [])

  const fetchPatientData = async () => {
    try {
      const response = await api.get('/api/patients/P002')
      setPatientData(response.data)
    } catch (error) {
      console.error('Error fetching patient data:', error)
      // Fallback local mock
      setPatientData({
        name: 'Sarah Miller',
        age: 32,
        gender: 'Female',
        blood_group: 'A+',
        conditions: ['Asthma'],
        medications: ['Ventolin Inhaler', 'Montelukast 10mg'],
        vitals: { bp: '118/76', heart_rate: 72, temperature: 98.4, weight: 65, height: 165 }
      })
    }
  }

  const fetchQueueStatus = async () => {
    try {
      const qRes = await api.get('/api/triage/queue')
      const activeUser = qRes.data.queue.find(
        x => x.patient_name.toLowerCase().includes('sarah') || x.patient_name.toLowerCase().includes('miller')
      )
      if (activeUser) {
        setActiveQueueStatus({
          position: qRes.data.queue.indexOf(activeUser) + 1,
          total: qRes.data.queue_length,
          wait: activeUser.estimated_wait,
          priority: activeUser.priority
        })
      } else {
        // Check if there is a general patient in the queue
        const demoUser = qRes.data.queue[qRes.data.queue.length - 1]
        if (demoUser) {
          // Check localStorage if the user enqueued someone else
          const savedName = localStorage.getItem('demo-patient-name')
          const matchedSaved = qRes.data.queue.find(x => x.patient_name === savedName)
          if (matchedSaved) {
            setActiveQueueStatus({
              name: matchedSaved.patient_name,
              position: qRes.data.queue.indexOf(matchedSaved) + 1,
              total: qRes.data.queue_length,
              wait: matchedSaved.estimated_wait,
              priority: matchedSaved.priority
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching queue position:', error)
    }
  }

  const loadNotifications = () => {
    const saved = localStorage.getItem('patient-notifications')
    if (saved) {
      setNotifications(JSON.parse(saved))
    } else {
      const initial = [
        { id: 1, message: 'Welcome to your digital twin patient health portal.', time: '1 hour ago', type: 'info' },
        { id: 2, message: 'Monthly asthma inhaler refill available at local pharmacy.', time: '2 days ago', type: 'success' }
      ]
      setNotifications(initial)
      localStorage.setItem('patient-notifications', JSON.stringify(initial))
    }
  }

  const loadAppointments = () => {
    const saved = localStorage.getItem('booked-appointments')
    if (saved) {
      setAppointments(JSON.parse(saved))
    } else {
      const initial = [
        { id: 'APT-8712', doctor: 'Dr. Sarah Johnson', specialty: 'Pulmonologist', date: 'Tomorrow', time: '2:30 PM', status: 'Confirmed' }
      ]
      setAppointments(initial)
      localStorage.setItem('booked-appointments', JSON.stringify(initial))
    }
  }

  return (
    <div className="patient-dashboard">
      <div className="patient-welcome">
        <div className="welcome-avatar">
          <User size={32} />
        </div>
        <div>
          <h2>Hello, {patientData?.name || 'Sarah Miller'}</h2>
          <p>Your Health AI Dashboard • Profile Status: Stable</p>
        </div>
      </div>

      {/* Grid: Health Metrics Telemetry */}
      <div className="vitals-dashboard-row">
        <h3>Vitals & Telemetry (Digital Twin)</h3>
        <div className="vitals-dashboard-grid">
          <div className="vital-card-pt bp">
            <span className="vital-label">Blood Pressure</span>
            <strong className="vital-value">{patientData?.vitals?.bp || '118/76'}</strong>
            <span className="vital-desc">Normal Range (120/80)</span>
          </div>

          <div className="vital-card-pt hr">
            <span className="vital-label">Heart Rate</span>
            <strong className="vital-value">{patientData?.vitals?.heart_rate || '72'} bpm</strong>
            <span className="vital-desc">Resting Heart Rate</span>
          </div>

          <div className="vital-card-pt temp">
            <span className="vital-label">Body Temperature</span>
            <strong className="vital-value">{patientData?.vitals?.temperature || '98.4'} °F</strong>
            <span className="vital-desc">Normal body temp</span>
          </div>

          <div className="vital-card-pt weight">
            <span className="vital-label">Weight & Height</span>
            <strong className="vital-value">{patientData?.vitals?.weight || '65'} kg / {patientData?.vitals?.height || '165'} cm</strong>
            <span className="vital-desc">BMI: 23.9 (Healthy)</span>
          </div>
        </div>
      </div>

      {/* Split Cards: Queue Status & Next Appointment */}
      <div className="dashboard-split-grid">
        {/* Queue Tracker Quick Info */}
        <div className="split-card-pt">
          <div className="card-header-pt">
            <Activity size={20} color="#3498DB" />
            <h4>Emergency Queue Status</h4>
          </div>
          <div className="card-body-pt">
            {activeQueueStatus ? (
              <div className="queue-quick-active">
                <div className="quick-token">
                  <span className="token-lbl">TOKEN POSITION</span>
                  <h2 className="token-val">#{activeQueueStatus.position}</h2>
                </div>
                <div className="quick-queue-info">
                  <p><strong>Patient:</strong> {activeQueueStatus.name || patientData?.name || 'Sarah Miller'}</p>
                  <p><strong>Wait Time:</strong> {activeQueueStatus.wait} minutes</p>
                  <p><strong>Priority Level:</strong> <span className="p-badge" style={{
                    color: activeQueueStatus.priority === 'Critical' ? '#E74C3C' : '#E67E22',
                    background: activeQueueStatus.priority === 'Critical' ? '#FDEDEC' : '#FDF2E9',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>{activeQueueStatus.priority}</span></p>
                </div>
                <button className="btn-quick-nav" onClick={() => navigate('/patient/queue')}>Track Position</button>
              </div>
            ) : (
              <div className="queue-quick-inactive">
                <AlertCircle size={32} color="#BDC3C7" />
                <p>You are not currently in the emergency care queue.</p>
                <button className="btn-quick-action" onClick={() => navigate('/patient/symptoms')}>Start Symptom Checker</button>
              </div>
            )}
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="split-card-pt">
          <div className="card-header-pt">
            <Calendar size={20} color="#9B59B6" />
            <h4>Active Bookings</h4>
          </div>
          <div className="card-body-pt">
            {appointments.length > 0 ? (
              <div className="apt-quick-active">
                {appointments.slice(0, 1).map((apt) => (
                  <div key={apt.id}>
                    <h5>{apt.doctor}</h5>
                    <p className="apt-spec">{apt.specialty}</p>
                    <div className="apt-time-box">
                      <Clock size={14} />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                    <span className="apt-status-badge">{apt.status}</span>
                  </div>
                ))}
                <button className="btn-quick-nav" onClick={() => navigate('/patient/appointments')}>Manage Appointments</button>
              </div>
            ) : (
              <div className="apt-quick-inactive">
                <Calendar size={32} color="#BDC3C7" />
                <p>No upcoming clinic visits scheduled.</p>
                <button className="btn-quick-action" onClick={() => navigate('/patient/appointments')}>Schedule Consultation</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditions & Prescriptions */}
      <div className="pt-medications-section">
        <div className="split-card-pt full-width">
          <div className="card-header-pt">
            <FileText size={20} color="#2ECC71" />
            <h4>Active Medications & Conditions</h4>
          </div>
          <div className="meds-list-pt">
            <div className="conditions-tags">
              <strong>Diagnosed Conditions:</strong>
              {patientData?.conditions?.map((cond, i) => (
                <span key={i} className="cond-tag">{cond}</span>
              ))}
            </div>
            <div className="meds-grid-pt">
              {patientData?.medications?.map((med, i) => (
                <div key={i} className="med-item-pt">
                  <CheckCircle size={16} color="#2ECC71" />
                  <span>{med} (1 daily dosage)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
