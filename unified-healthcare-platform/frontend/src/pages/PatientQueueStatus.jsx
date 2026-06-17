import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, Flame, ShieldAlert, CheckCircle, RefreshCw, AlertCircle, MapPin } from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientQueueStatus() {
  const navigate = useNavigate()
  const [queueList, setQueueList] = useState([])
  const [patientName, setPatientName] = useState(() => localStorage.getItem('demo-patient-name') || 'Sarah Miller')
  const [activeUser, setActiveUser] = useState(null)
  const [position, setPosition] = useState(0)
  const [allocatedHospital, setAllocatedHospital] = useState(() => localStorage.getItem('allocated-hospital-name') || '')
  const [loading, setLoading] = useState(false)
  const [isResolved, setIsResolved] = useState(false)

  // Real-time simulated states
  const [displayPosition, setDisplayPosition] = useState(null)
  const [displayWaitTime, setDisplayWaitTime] = useState(null)

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 3000) // Poll every 3 seconds for real-time synchronization
    return () => clearInterval(interval)
  }, [patientName])

  // Simulation effect that ticks position & wait time down every 8 seconds
  useEffect(() => {
    if (!activeUser || displayPosition === null || displayPosition === 0) return

    const simInterval = setInterval(async () => {
      if (displayPosition > 1) {
        const nextPos = displayPosition - 1
        const nextWait = Math.max(2, Math.round(displayWaitTime - (displayWaitTime / displayPosition)))
        
        setDisplayPosition(nextPos)
        setDisplayWaitTime(nextWait)
        localStorage.setItem(`queue-pos-${patientName}`, nextPos.toString())
        localStorage.setItem(`queue-wait-${patientName}`, nextWait.toString())

        // Append custom notification for real-time progression visibility
        const newNotif = {
          id: Date.now(),
          message: `Queue update: You have moved up to position #${nextPos}. Estimated wait time: ${nextWait} mins.`,
          time: 'Just now',
          type: 'info'
        }
        const savedNotifs = localStorage.getItem('patient-notifications')
        const parsedNotifs = savedNotifs ? JSON.parse(savedNotifs) : []
        parsedNotifs.unshift(newNotif)
        localStorage.setItem('patient-notifications', JSON.stringify(parsedNotifs))
      } else if (displayPosition === 1) {
        // Trigger auto-allocation & resolve backend queue entry
        try {
          await api.post('/api/triage/queue/resolve', { patient_name: patientName })
          
          setDisplayPosition(0)
          setDisplayWaitTime(0)
          localStorage.removeItem(`queue-pos-${patientName}`)
          localStorage.removeItem(`queue-wait-${patientName}`)
          
          if (!allocatedHospital) {
            const defaultHospital = 'Apollo Medical Center'
            setAllocatedHospital(defaultHospital)
            localStorage.setItem('allocated-hospital-name', defaultHospital)
          }

          // Create success notification
          const successNotif = {
            id: Date.now(),
            message: `Emergency bed allocation complete: Bed reserved. Dispatch active.`,
            time: 'Just now',
            type: 'success'
          }
          const savedNotifs = localStorage.getItem('patient-notifications')
          const parsedNotifs = savedNotifs ? JSON.parse(savedNotifs) : []
          parsedNotifs.unshift(successNotif)
          localStorage.setItem('patient-notifications', JSON.stringify(parsedNotifs))

          fetchQueue()
        } catch (error) {
          console.error('Error auto-resolving patient:', error)
        }
      }
    }, 8000)

    return () => clearInterval(simInterval)
  }, [activeUser, displayPosition, displayWaitTime, patientName, allocatedHospital])

  const fetchQueue = async () => {
    try {
      const response = await api.get('/api/triage/queue')
      const list = response.data.queue
      setQueueList(list)

      const user = list.find(x => x.patient_name.toLowerCase() === patientName.toLowerCase())
      
      if (user) {
        setActiveUser(user)
        const pos = list.indexOf(user) + 1
        setPosition(pos)
        setIsResolved(false)

        // Sync and initialize simulated displays
        const cachedPos = localStorage.getItem(`queue-pos-${patientName}`)
        const cachedWait = localStorage.getItem(`queue-wait-${patientName}`)

        if (cachedPos && cachedWait) {
          const parsedPos = parseInt(cachedPos)
          if (pos < parsedPos) {
            setDisplayPosition(pos)
            setDisplayWaitTime(user.estimated_wait)
            localStorage.setItem(`queue-pos-${patientName}`, pos.toString())
            localStorage.setItem(`queue-wait-${patientName}`, user.estimated_wait.toString())
          } else {
            setDisplayPosition(parsedPos)
            setDisplayWaitTime(parseInt(cachedWait))
          }
        } else {
          setDisplayPosition(pos)
          setDisplayWaitTime(user.estimated_wait)
          localStorage.setItem(`queue-pos-${patientName}`, pos.toString())
          localStorage.setItem(`queue-wait-${patientName}`, user.estimated_wait.toString())
        }
      } else {
        // If they were enqueued but are no longer in the queue, they were either resolved or not yet enqueued
        const savedName = localStorage.getItem('demo-patient-name')
        if (savedName && savedName.toLowerCase() === patientName.toLowerCase()) {
          // If they are no longer in the queue list, it means the hospital staff click 'Resolve' or 'Allocate Bed'!
          setIsResolved(true)
          setActiveUser(null)
        } else {
          setActiveUser(null)
        }
      }
    } catch (error) {
      console.error('Error fetching queue:', error)
    }
  }

  const handleManualRefresh = async () => {
    setLoading(true)
    await fetchQueue()
    setLoading(false)
  }

  const handleResetDemo = () => {
    localStorage.removeItem('demo-patient-name')
    localStorage.removeItem('allocated-hospital-name')
    localStorage.removeItem(`queue-pos-${patientName}`)
    localStorage.removeItem(`queue-wait-${patientName}`)
    setPatientName('Sarah Miller')
    setIsResolved(false)
    setActiveUser(null)
    setDisplayPosition(null)
    setDisplayWaitTime(null)
    navigate('/patient/symptoms')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#E74C3C'
      case 'High': return '#E67E22'
      case 'Medium': return '#F1C40F'
      case 'Low': return '#2ECC71'
      default: return '#7F8C8D'
    }
  }

  return (
    <div className="patient-queue-status">
      <div className="status-header">
        <Clock size={32} color="#3498DB" />
        <div>
          <h2>Emergency Care Queue Tracker</h2>
          <p>Real-time queue tracking. Your status updates dynamically when hospital coordinators allocate resources.</p>
        </div>
        <button className={`btn-refresh-pt ${loading ? 'spinning' : ''}`} onClick={handleManualRefresh}>
          <RefreshCw size={16} />
        </button>
      </div>

      {activeUser ? (
        <div className="active-tracker-layout animate-fade-in">
          {/* Token Card */}
          <div className="token-card-pt">
            <div className="token-card-header">
              <span>EMERGENCY TRIAGE TICKET</span>
              <strong>TOKEN #{1024 + (displayPosition !== null ? displayPosition : position)}</strong>
            </div>
            
            <div className="token-card-body">
              <div className="token-main-stat">
                <span className="lbl">QUEUE POSITION</span>
                <h1 className="val">#{displayPosition !== null ? displayPosition : position}</h1>
                <span className="sub">Out of {queueList.length} patients in wait-list</span>
              </div>

              <div className="token-details">
                <div className="row-detail">
                  <span>Patient:</span>
                  <strong>{activeUser.patient_name}</strong>
                </div>
                <div className="row-detail">
                  <span>Priority:</span>
                  <span className="p-badge-status" style={{ 
                    color: getPriorityColor(activeUser.priority),
                    background: getPriorityColor(activeUser.priority) + '15'
                  }}>
                    {activeUser.priority}
                  </span>
                </div>
                <div className="row-detail">
                  <span>Est. Wait Time:</span>
                  <strong>{displayWaitTime !== null ? displayWaitTime : activeUser.estimated_wait} Mins</strong>
                </div>
                <div className="row-detail">
                  <span>Symptoms:</span>
                  <strong className="sym-text">{activeUser.symptoms}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Visualizer */}
          <div className="journey-tracker-card">
            <h4>Live Care Coordination Progress</h4>
            <div className="progress-timeline">
              <div className="timeline-node checked">
                <div className="node-marker">✓</div>
                <div className="node-content">
                  <h5>Symptom Analysis Complete</h5>
                  <p>AI calculated risk metrics and identified specialists.</p>
                </div>
              </div>

              <div className="timeline-node checked">
                <div className="node-marker">✓</div>
                <div className="node-content">
                  <h5>Enqueued in Priority Queue</h5>
                  <p>Placed at position #{displayPosition !== null ? displayPosition : position} based on urgency classification.</p>
                </div>
              </div>

              <div className="timeline-node active">
                <div className="node-marker pulse"></div>
                <div className="node-content">
                  <h5>Awaiting Bed & Hospital Allocation</h5>
                  <p>Hospital staff are reviewing your vitals and allocating ICU/general ward beds.</p>
                </div>
              </div>

              <div className="timeline-node pending">
                <div className="node-marker"></div>
                <div className="node-content">
                  <h5>Dispatch & Treatment Initiation</h5>
                  <p>Ambulance dispatch, blood reservations, and pharmacy pre-compiling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isResolved ? (
        <div className="resolved-tracker-layout animate-fade-in">
          <div className="success-alert-card">
            <div className="alert-circle-wrap">
              <ShieldAlert size={32} color="#2ECC71" />
            </div>
            <div>
              <h3>Bed Allocated & Ambulance Dispatched!</h3>
              <p>Your emergency triage ticket has been processed. Resources are locked at your destination.</p>
            </div>
          </div>

          <div className="allocated-hospital-details">
            <h4>Allocation Details</h4>
            <div className="detail-table-pt">
              <div className="dt-row">
                <span>Allocated Hospital:</span>
                <strong>{allocatedHospital || 'Apollo Medical Center'}</strong>
              </div>
              <div className="dt-row">
                <span>Emergency Bed:</span>
                <strong>ICU / ER Bed Reserved (Locked)</strong>
              </div>
              <div className="dt-row">
                <span>Blood Stock Hold:</span>
                <strong>1 Unit matching your type held at hospital bank</strong>
              </div>
              <div className="dt-row">
                <span>Pharmacy Pre-order:</span>
                <strong>Pre-compiled therapeutic dosage dispatched to ICU ward</strong>
              </div>
              <div className="dt-row">
                <span>Recommended Action:</span>
                <strong>Remain calm. Cardiac response unit is en-route.</strong>
              </div>
            </div>

            <button className="btn-secondary full-width" style={{ marginTop: '24px' }} onClick={handleResetDemo}>
              Clear Triage & Start New Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-tracker-card animate-fade-in">
          <AlertCircle size={48} color="#BDC3C7" />
          <h3>No Active Triage Ticket</h3>
          <p>Please use our AI Symptom Checker to perform triage and get added to the priority queue.</p>
          <button className="btn-primary" onClick={() => navigate('/patient/symptoms')}>
            Assess Symptoms Now
          </button>
        </div>
      )}
    </div>
  )
}

export default PatientQueueStatus
