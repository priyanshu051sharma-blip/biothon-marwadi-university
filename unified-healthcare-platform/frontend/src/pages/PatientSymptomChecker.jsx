import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, 
  Flame, 
  MapPin, 
  Building2, 
  Clock, 
  ShieldAlert, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Check, 
  ChevronRight 
} from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientSymptomChecker() {
  const navigate = useNavigate()
  const [patientName, setPatientName] = useState('Sarah Miller')
  const [bloodGroup, setBloodGroup] = useState('A+')
  const [symptoms, setSymptoms] = useState('')
  const [severity, setSeverity] = useState(5)
  const [voiceSimulating, setVoiceSimulating] = useState(false)
  
  // Results
  const [loading, setLoading] = useState(false)
  const [triageResult, setTriageResult] = useState(null)

  const handleVoiceInputSimulate = () => {
    setVoiceSimulating(true)
    const text = 'Severe chest tightness, stabbing pain in left shoulder, feeling dizzy and short of breath.'
    let i = 0
    setSymptoms('')
    const interval = setInterval(() => {
      setSymptoms(prev => prev + text.charAt(i))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setVoiceSimulating(false)
      }
    }, 40)
  }

  const handleAnalyze = async () => {
    if (!patientName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!symptoms.trim()) {
      alert('Please describe your symptoms')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/api/triage/analyze', {
        patient_name: patientName,
        blood_group: bloodGroup,
        symptoms: symptoms
      })
      setTriageResult(response.data)
    } catch (error) {
      console.error('Triage failed:', error)
      alert('Triage analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinQueueAndRequestBed = async () => {
    if (!triageResult) return

    try {
      // Save patient name to track queue status locally
      localStorage.setItem('demo-patient-name', patientName)
      
      // Enqueue patient
      await api.post('/api/triage/queue/add', {
        patient_name: patientName,
        risk_score: triageResult.risk_score,
        priority: triageResult.priority,
        symptoms: symptoms,
        estimated_wait: triageResult.priority === 'Critical' ? 2 : triageResult.priority === 'High' ? 12 : 25
      })

      // Select top hospital matching
      const topHospital = triageResult.recommended_hospitals[0]?.name || 'Apollo Medical Center'
      
      // Log Notification
      const newNotif = {
        id: Date.now(),
        message: `Triage complete. Enqueued at position #1. Recommended dispatch: ${topHospital}. Waiting for bed allocation.`,
        time: 'Just now',
        type: 'warning'
      }
      const savedNotifs = localStorage.getItem('patient-notifications')
      const parsedNotifs = savedNotifs ? JSON.parse(savedNotifs) : []
      parsedNotifs.unshift(newNotif)
      localStorage.setItem('patient-notifications', JSON.stringify(parsedNotifs))
      
      // Save selected hospital for dispatch simulator
      localStorage.setItem('allocated-hospital-name', topHospital)

      navigate('/patient/queue')
    } catch (error) {
      console.error('Error joining queue:', error)
    }
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

  const getPriorityBackground = (priority) => {
    switch (priority) {
      case 'Critical': return '#FDEDEC'
      case 'High': return '#FDF2E9'
      case 'Medium': return '#FEF9E7'
      case 'Low': return '#E8F8F5'
      default: return '#F2F4F4'
    }
  }

  return (
    <div className="patient-symptom-checker">
      <div className="checker-header">
        <Brain size={32} color="#3498DB" />
        <div>
          <h2>AI Symptom Checker & Emergency Triage</h2>
          <p>Instant clinical urgency assessment. Your symptoms are run through a Bayesian predictor.</p>
        </div>
      </div>

      {!triageResult ? (
        <div className="checker-form-card">
          <div className="form-group">
            <label>Patient Full Name</label>
            <input 
              type="text" 
              placeholder="Your name" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <div className="label-with-action">
              <label>Symptom Description</label>
              <button 
                className={`voice-simulate-btn ${voiceSimulating ? 'active' : ''}`}
                onClick={handleVoiceInputSimulate}
                disabled={voiceSimulating}
              >
                <Mic size={14} />
                <span>{voiceSimulating ? 'Voice Input Simulating...' : 'Simulate Voice Input'}</span>
              </button>
            </div>
            <textarea 
              rows="4" 
              placeholder="Describe what you are feeling (e.g. pain location, duration, severity...)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Approximate Severity Level (1 - 10)</label>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={severity} 
                onChange={(e) => setSeverity(e.target.value)}
                className="severity-slider"
              />
              <span className="slider-value">{severity}/10</span>
            </div>
          </div>

          <button className="btn-pt-submit" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'AI Analyzing Symptoms...' : 'Process Diagnostics'}
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="checker-results-pane animate-fade-in">
          {/* Risk Card */}
          <div className="triage-result-card" style={{ borderLeft: `6px solid ${getPriorityColor(triageResult.priority)}` }}>
            <div className="risk-score-display">
              <div className="gauge-container">
                <div className="gauge-circle" style={{ '--score': triageResult.risk_score, '--color': getPriorityColor(triageResult.priority) }}>
                  <div className="gauge-inner">
                    <span className="gauge-value">{triageResult.risk_score}</span>
                    <span className="gauge-label">RISK</span>
                  </div>
                </div>
              </div>
              
              <div className="triage-info">
                <span className="priority-label" style={{ 
                  color: getPriorityColor(triageResult.priority),
                  backgroundColor: getPriorityBackground(triageResult.priority)
                }}>
                  {triageResult.priority} PRIORITY
                </span>
                <h3>Predicted: {triageResult.disease_name}</h3>
                <p>Urgency Rating: <strong>{triageResult.urgency.toUpperCase()}</strong></p>
              </div>
            </div>

            <div className="action-recommendation">
              <ShieldAlert size={20} color={getPriorityColor(triageResult.priority)} />
              <div>
                <h5>Triage Guideline Action:</h5>
                <p>{triageResult.recommended_action}</p>
              </div>
            </div>
          </div>

          {/* Hospital Match Suggestions */}
          <div className="hospital-matcher-row">
            <h4>Recommended Hospital Facilities</h4>
            <p className="subtext">Nearest network hospitals matched by emergency departments, bed availabilities, and blood bank levels.</p>
            
            <div className="hospitals-recommendation-list">
              {triageResult.recommended_hospitals.map((h, i) => (
                <div key={i} className="hospital-match-card">
                  <div className="hospital-match-header">
                    <div>
                      <h5>{h.name}</h5>
                      <span className="distance-span">{h.distance} • ⭐ {h.rating}</span>
                    </div>
                    <div className="match-score-badge">
                      <span className="score-val">{h.match_score}%</span>
                      <span className="score-lbl">MATCH</span>
                    </div>
                  </div>
                  <div className="match-reasons">
                    {h.reasons.slice(0, 3).map((r, rI) => (
                      <div key={rI} className="reason-item">
                        <span className="check-dot">✓</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="buttons-row">
            <button className="btn-secondary" onClick={() => setTriageResult(null)}>Edit Symptoms</button>
            <button className="btn-primary" onClick={handleJoinQueueAndRequestBed}>
              Request Immediate Bed & Join Queue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientSymptomChecker
