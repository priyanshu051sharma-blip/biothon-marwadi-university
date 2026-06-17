import { useState, useEffect } from 'react'
import { Bell, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientNotifications() {
  const [notifications, setNotifications] = useState([])
  const [patientName, setPatientName] = useState(() => localStorage.getItem('demo-patient-name') || 'Sarah Miller')

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(checkLiveUpdates, 3000)
    return () => clearInterval(interval)
  }, [patientName])

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

  const checkLiveUpdates = async () => {
    try {
      const response = await api.get('/api/triage/queue')
      const userInQueue = response.data.queue.find(x => x.patient_name.toLowerCase() === patientName.toLowerCase())

      const savedNotifs = localStorage.getItem('patient-notifications')
      let parsed = savedNotifs ? JSON.parse(savedNotifs) : []

      if (!userInQueue) {
        // If the user was enqueued, and is now resolved, check if we've already added the success notif
        const hospitalName = localStorage.getItem('allocated-hospital-name')
        const hasSuccessNotif = parsed.some(n => n.message.includes('Bed Allocated') || n.message.includes('Ambulance Dispatched'))

        if (hospitalName && !hasSuccessNotif && localStorage.getItem('demo-patient-name')) {
          // Clinician clicked 'Allocate Bed' or 'Resolve'
          const newNotif = {
            id: Date.now(),
            message: `Bed Allocated at ${hospitalName}! Emergency ambulance dispatched and blood reserved.`,
            time: 'Just now',
            type: 'success'
          }
          parsed.unshift(newNotif)
          localStorage.setItem('patient-notifications', JSON.stringify(parsed))
          setNotifications(parsed)
        }
      }
    } catch (error) {
      console.error('Error syncing notifications with queue status:', error)
    }
  }

  const handleClearAll = () => {
    const cleared = [
      { id: Date.now(), message: 'Notifications cleared.', time: 'Just now', type: 'info' }
    ]
    setNotifications(cleared)
    localStorage.setItem('patient-notifications', JSON.stringify(cleared))
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="#2ECC71" />
      case 'warning': return <AlertCircle size={18} color="#E67E22" />
      case 'info': return <Info size={18} color="#3498DB" />
      default: return <Bell size={18} color="#7F8C8D" />
    }
  }

  return (
    <div className="patient-notifications">
      <div className="status-header">
        <Bell size={32} color="#3498DB" />
        <div>
          <h2>Platform Alerts & Notifications</h2>
          <p>Real-time telemetry reports, appointment reminders, and emergency bed coordination updates.</p>
        </div>
        <button className="btn-clear-notif" onClick={handleClearAll}>
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="notifications-list-pt">
        {notifications.length === 0 ? (
          <p className="empty-text-pt">No alerts logged.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`notif-card-pt ${notif.type}`}>
              <div className="notif-icon-pt">
                {getNotifIcon(notif.type)}
              </div>
              <div className="notif-content-pt">
                <p>{notif.message}</p>
                <span className="notif-time-pt">{notif.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PatientNotifications
