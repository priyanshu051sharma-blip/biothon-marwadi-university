import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Flame, 
  Activity, 
  Clock, 
  CheckCircle, 
  Plus, 
  Check, 
  Building2, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Phone, 
  Search,
  FileText,
  X,
  ChevronRight,
  TrendingDown
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'
import api from '../services/api'
import './TriageQueueDashboard.css'

function TriageQueueDashboard() {
  const location = useLocation()
  const isTriagePage = location.pathname === '/admin/triage'
  const isQueuePage = location.pathname === '/admin/queue'

  // Demo journey states
  const [demoStep, setDemoStep] = useState(1) // 1: Input, 2: Triage, 3: Enqueue, 4: Hospital, 5: Ticket
  const [patientName, setPatientName] = useState('')
  const [bloodGroup, setBloodGroup] = useState('O-')
  const [symptoms, setSymptoms] = useState('')
  
  // Triage results state
  const [triageResult, setTriageResult] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [allocating, setAllocating] = useState(false)
  const [allocationDone, setAllocationDone] = useState(false)
  const [activePreset, setActivePreset] = useState(null)
  
  // Dashboard overall states
  const [queueData, setQueueData] = useState([])
  const [servedToday, setServedToday] = useState(14)
  const [queueMetrics, setQueueMetrics] = useState({ length: 0, avg_wait: 0 })
  const [forecastMetrics, setForecastMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [triageLoading, setTriageLoading] = useState(false)

  // Quick scenario presets
  const presets = [
    {
      id: 'heart-attack',
      label: '💔 Suspected ACS (Heart Attack)',
      name: 'Arthur Pendelton',
      blood: 'O-',
      symptoms: 'Severe crushing chest pain radiating to left arm and jaw, profuse sweating, shortness of breath for 15 minutes.'
    },
    {
      id: 'asthma',
      label: '🫁 Severe Asthma Attack',
      name: 'Clarissa Vance',
      blood: 'A+',
      symptoms: 'Acute shortness of breath, loud wheezing on expiration, using accessory muscles to breathe, unable to complete sentences.'
    },
    {
      id: 'flu',
      label: '🤒 Influenza Symptoms',
      name: 'Julian Barnes',
      blood: 'B+',
      symptoms: 'Mild fever of 100.4F, dry cough, slight muscle fatigue, scratchy throat for 2 days.'
    }
  ]

  // Fetch queue and forecast on load
  useEffect(() => {
    fetchQueue()
    fetchForecast()
  }, [])

  const fetchQueue = async () => {
    try {
      const response = await api.get('/api/triage/queue')
      setQueueData(response.data.queue)
      setServedToday(response.data.served_today)
      setQueueMetrics({
        length: response.data.queue_length,
        avg_wait: response.data.avg_wait_time
      })
    } catch (error) {
      console.error('Error fetching triage queue:', error)
    }
  }

  const fetchForecast = async () => {
    try {
      const response = await api.get('/api/triage/forecast')
      setForecastMetrics(response.data)
    } catch (error) {
      console.error('Error fetching forecasts:', error)
    }
  }

  const handleApplyPreset = (preset) => {
    setPatientName(preset.name)
    setBloodGroup(preset.blood)
    setSymptoms(preset.symptoms)
    setActivePreset(preset.id)
  }

  const handleRunTriage = async () => {
    if (!patientName.trim()) {
      alert('Please enter patient name')
      return
    }
    if (!symptoms.trim()) {
      alert('Please describe symptoms')
      return
    }

    setTriageLoading(true)
    try {
      const response = await api.post('/api/triage/analyze', {
        patient_name: patientName,
        blood_group: bloodGroup,
        symptoms: symptoms
      })
      setTriageResult(response.data)
      setDemoStep(2)
    } catch (error) {
      console.error('Triage analysis failed:', error)
      alert('Triage analysis failed. Please try again.')
    } finally {
      setTriageLoading(false)
    }
  }

  const handleEnqueue = async () => {
    if (!triageResult) return

    setLoading(true)
    try {
      await api.post('/api/triage/queue/add', {
        patient_name: patientName,
        risk_score: triageResult.risk_score,
        priority: triageResult.priority,
        symptoms: symptoms,
        estimated_wait: triageResult.priority === 'Critical' ? 2 : triageResult.priority === 'High' ? 12 : 25
      })
      await fetchQueue()
      setDemoStep(3)
    } catch (error) {
      console.error('Enqueue failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolvePatient = async (name) => {
    try {
      await api.post('/api/triage/queue/resolve', { patient_name: name })
      await fetchQueue()
    } catch (error) {
      console.error('Resolve patient failed:', error)
    }
  }

  const handleAllocateResources = (hospital) => {
    setSelectedHospital(hospital)
    setAllocating(true)
    setTimeout(() => {
      setAllocating(false)
      setAllocationDone(true)
      setDemoStep(5)
    }, 1500)
  }

  const handleResetDemo = () => {
    setPatientName('')
    setBloodGroup('O-')
    setSymptoms('')
    setTriageResult(null)
    setSelectedHospital(null)
    setAllocationDone(false)
    setActivePreset(null)
    setDemoStep(1)
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
    <div className="triage-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>
            {isTriagePage 
              ? 'Emergency Triage Simulator' 
              : isQueuePage 
                ? 'Queue Management & Optimization' 
                : 'Emergency Triage & Queue Coordination'}
          </h1>
          <p>
            {isTriagePage 
              ? 'Simulate clinical triage scenarios and AI-powered hospital matching.' 
              : isQueuePage 
                ? 'Real-time patient queue priorities and predictive facility load forecasting.' 
                : 'Real-time AI patient prioritisation, hospital matching and clinical load forecasting.'}
          </p>
        </div>
        <div className="live-status">
          <span className="pulse-dot"></span>
          <span>Triage Engine Active</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="metrics-row">
        <div className="metric-card gradient-red">
          <div className="metric-icon">
            <Flame size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Active Queue Length</span>
            <h2 className="metric-value">{queueMetrics.length} Patients</h2>
            <span className="metric-sub">{queueMetrics.length > 3 ? '🔴 High Influx Alert' : '🟢 Optimal load'}</span>
          </div>
        </div>

        <div className="metric-card gradient-blue">
          <div className="metric-icon">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Avg Wait Time</span>
            <h2 className="metric-value">{queueMetrics.avg_wait} Min</h2>
            <span className="metric-sub">Target: &lt; 20 Mins</span>
          </div>
        </div>

        <div className="metric-card gradient-green">
          <div className="metric-icon">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Served Today</span>
            <h2 className="metric-value">{servedToday} Patients</h2>
            <span className="metric-sub">100% Triage Compliance</span>
          </div>
        </div>

        <div className="metric-card gradient-purple">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Tomorrow's Forecast Load</span>
            <h2 className="metric-value">{forecastMetrics?.tomorrow_load || 142} Cases</h2>
            <span className="metric-sub text-red">
              <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
              +{forecastMetrics?.tomorrow_load_change}% expected load
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={`triage-grid ${isTriagePage || isQueuePage ? 'single-col' : ''}`}>
        {/* Left Column: Interactive Triage Journey */}
        {!isQueuePage && (
          <div className="triage-panel journey-panel">
            <div className="panel-header">
              <h3>My Triage Workflow</h3>
              <span className="badge-step">Step {demoStep} of 5</span>
            </div>

          {/* Stepper Progress Bar */}
          <div className="stepper">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step} 
                className={`step-dot ${demoStep === step ? 'active' : ''} ${demoStep > step ? 'completed' : ''}`}
                onClick={() => { if(demoStep > step) setDemoStep(step) }}
              >
                {demoStep > step ? <Check size={12} /> : step}
              </div>
            ))}
          </div>

          <div className="journey-body">
            {/* Step 1: Input & Presets */}
            {demoStep === 1 && (
              <div className="step-content">
                <h4>1. Describe Emergency Symptoms</h4>
                <p className="step-description">Fill out the patient details below or select an emergency preset scenario to simulate high-acuity triage.</p>

                <div className="preset-container">
                  <span className="preset-title">Select Demo Preset:</span>
                  <div className="presets-list">
                    {presets.map((preset) => (
                      <button 
                        key={preset.id} 
                        className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
                        onClick={() => handleApplyPreset(preset)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Patient Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Anderson" 
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
                  <label>Emergency Symptoms & Clinical Indicators</label>
                  <textarea 
                    rows="4" 
                    placeholder="Describe emergency symptoms, duration, pain scale, and underlying conditions..." 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>

                <button 
                  className="btn-submit" 
                  onClick={handleRunTriage}
                  disabled={triageLoading}
                >
                  {triageLoading ? 'Computing Triage Matrix...' : 'Run AI Triage Assessment'}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Risk Score & Priority */}
            {demoStep === 2 && triageResult && (
              <div className="step-content">
                <h4>2. Triage Priority Assessment</h4>
                <p className="step-description">AI has processed symptoms and calculated the emergency severity score.</p>

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
                      <h3>Condition: {triageResult.disease_name}</h3>
                      <p><strong>Primary Specialist:</strong> {triageResult.specialists.join(', ')}</p>
                    </div>
                  </div>

                  <div className="action-recommendation">
                    <ShieldAlert size={20} color={getPriorityColor(triageResult.priority)} />
                    <div>
                      <h5>Recommended Action:</h5>
                      <p>{triageResult.recommended_action}</p>
                    </div>
                  </div>
                </div>

                <div className="buttons-row">
                  <button className="btn-secondary" onClick={() => setDemoStep(1)}>Back</button>
                  <button className="btn-primary" onClick={handleEnqueue} disabled={loading}>
                    {loading ? 'Admitting...' : 'Admit & Enqueue Patient'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Priority Queue Placement */}
            {demoStep === 3 && triageResult && (
              <div className="step-content">
                <h4>3. Dynamic Queue Optimization</h4>
                <p className="step-description">The patient has been enqueued into the smart priority queue system. Critical and High priority patients bypass standard queue entries dynamically.</p>

                <div className="queue-bypass-alert">
                  <div className="alert-icon-wrap">
                    <CheckCircle size={28} color="#2ECC71" />
                  </div>
                  <div>
                    <h5>Patient Successfully Enqueued</h5>
                    <p>
                      <strong>{patientName}</strong> has been allocated position in the queue. 
                      {triageResult.priority === 'Critical' && ' Bypassed lower priority patients automatically.'}
                    </p>
                  </div>
                </div>

                <div className="queue-details-box">
                  <div className="detail-item">
                    <span>Priority</span>
                    <strong style={{ color: getPriorityColor(triageResult.priority) }}>{triageResult.priority}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Position</span>
                    <strong>
                      #{queueData.findIndex(x => x.patient_name === patientName) + 1} of {queueData.length}
                    </strong>
                  </div>
                  <div className="detail-item">
                    <span>Est. Wait Time</span>
                    <strong>{triageResult.priority === 'Critical' ? 'Immediate (< 2 Mins)' : `${triageResult.priority === 'High' ? '12' : '25'} mins`}</strong>
                  </div>
                </div>

                <div className="buttons-row">
                  <button className="btn-primary full-width" onClick={() => setDemoStep(4)}>
                    Evaluate Hospital Resource Match
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: AI Hospital Recommendations */}
            {demoStep === 4 && triageResult && (
              <div className="step-content">
                <h4>4. Resource & Specialty Matcher</h4>
                <p className="step-description">Top recommended hospitals based on real-time bed inventories, blood stocks, specialist availability, and proximity.</p>

                <div className="hospitals-recommendation-list">
                  {triageResult.recommended_hospitals.map((hospital, idx) => (
                    <div key={idx} className="hospital-match-card">
                      <div className="hospital-match-header">
                        <div>
                          <h5>{hospital.name}</h5>
                          <span className="distance-span">{hospital.distance} • ⭐ {hospital.rating}</span>
                        </div>
                        <div className="match-score-badge">
                          <span className="score-val">{hospital.match_score}%</span>
                          <span className="score-lbl">MATCH</span>
                        </div>
                      </div>
                      
                      <div className="match-reasons">
                        {hospital.reasons.map((reason, rIdx) => (
                          <div key={rIdx} className="reason-item">
                            <span className="check-dot">✓</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        className="btn-select-hospital" 
                        onClick={() => handleAllocateResources(hospital)}
                        disabled={allocating}
                      >
                        {allocating && selectedHospital?.name === hospital.name ? 'Allocating Resources...' : 'Dispatch & Allocate Bed'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="buttons-row" style={{ marginTop: '16px' }}>
                  <button className="btn-secondary" onClick={() => setDemoStep(3)}>Back</button>
                </div>
              </div>
            )}

            {/* Step 5: Resource Allocation Receipt */}
            {demoStep === 5 && selectedHospital && triageResult && (
              <div className="step-content text-center">
                <div className="success-circle-anim">
                  <CheckCircle size={64} color="#2ECC71" />
                </div>
                
                <h4>5. Triage Coordination Complete</h4>
                <p className="step-description">Emergency dispatcher ticket generated. Critical care resources have been successfully reserved.</p>

                <div className="ticket-receipt">
                  <div className="ticket-header">
                    <h5>EMERGENCY DISPATCH REPORT</h5>
                    <span>ID: REG-{(Date.now() % 100000)}</span>
                  </div>
                  <div className="ticket-body">
                    <div className="ticket-row">
                      <span>Patient Name:</span>
                      <strong>{patientName}</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Triage Priority:</span>
                      <strong style={{ color: getPriorityColor(triageResult.priority) }}>{triageResult.priority} (Score {triageResult.risk_score})</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Condition:</span>
                      <strong>{triageResult.disease_name}</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Destination:</span>
                      <strong>{selectedHospital.name} ({selectedHospital.distance})</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Bed Reserved:</span>
                      <strong>{triageResult.priority === 'Critical' ? 'ICU Bed Allocated' : 'Emergency Ward Bed Allocated'}</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Blood Reserved:</span>
                      <strong>1 Unit {bloodGroup} (Red-Coded Reservation)</strong>
                    </div>
                    <div className="ticket-row">
                      <span>Pharmacy Dispatch:</span>
                      <strong>Therapeutic dosage compiled & flagged for arrival</strong>
                    </div>
                  </div>
                </div>

                <button className="btn-submit full-width" onClick={handleResetDemo}>
                  Restart Triage Workflow
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Right Column: Queue Monitor & Predictive load forecasts */}
        {!isTriagePage && (
          <div className="triage-right-column">
            {/* Smart Priority Queue Monitor */}
            <div className="triage-panel queue-monitor-panel">
            <div className="panel-header">
              <h3>Live Triage Priority Queue</h3>
              <span className="queue-count">{queueData.length} Active Patients</span>
            </div>

            <div className="queue-table-wrapper">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Risk</th>
                    <th>Priority</th>
                    <th>Arrival</th>
                    <th>Est. Wait</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queueData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">No patients currently enqueued.</td>
                    </tr>
                  ) : (
                    queueData.map((item, idx) => (
                      <tr key={idx} className={item.patient_name === patientName ? 'active-demo-row' : ''}>
                        <td>
                          <div className="patient-name-cell">
                            <strong>{item.patient_name}</strong>
                            <span className="symptom-preview">{item.symptoms}</span>
                          </div>
                        </td>
                        <td>
                          <strong className="risk-text">{item.risk_score}</strong>
                        </td>
                        <td>
                          <span className="badge-priority" style={{ 
                            color: getPriorityColor(item.priority),
                            backgroundColor: getPriorityBackground(item.priority)
                          }}>
                            {item.priority}
                          </span>
                        </td>
                        <td>{item.arrival_time}</td>
                        <td>
                          <div className="wait-cell">
                            <Clock size={12} />
                            <span>{item.estimated_wait} Min</span>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn-action-resolve" 
                            onClick={() => handleResolvePatient(item.patient_name)}
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Load Forecasting & Analytics predictions */}
          <div className="triage-panel load-forecast-panel">
            <div className="panel-header">
              <h3>Predictive Load Forecasting</h3>
              <span className="badge-model">CNN-ARIMA Model</span>
            </div>
            
            <div className="forecast-indicators">
              <div className="ind-card">
                <span className="ind-lbl">Tomorrow Load</span>
                <span className="ind-val">{forecastMetrics?.tomorrow_load || 142} Cases</span>
                <span className="ind-change text-red">
                  <TrendingUp size={12} />
                  +{forecastMetrics?.tomorrow_load_change}% expected
                </span>
              </div>
              <div className="ind-card">
                <span className="ind-lbl">ICU Occupancy</span>
                <span className="ind-val">{forecastMetrics?.expected_icu_occupancy || 88}%</span>
                <span className="ind-change text-red">
                  <TrendingUp size={12} />
                  +{forecastMetrics?.expected_icu_change}% vs today
                </span>
              </div>
              <div className="ind-card">
                <span className="ind-lbl">Est. Queue Wait</span>
                <span className="ind-val">{forecastMetrics?.expected_wait_time || 18} min</span>
                <span className="ind-change text-green">
                  <TrendingDown size={12} />
                  {forecastMetrics?.expected_wait_change}% wait improvement
                </span>
              </div>
            </div>

            {/* Recharts Comparison Area Chart */}
            <div className="forecast-chart-container">
              <h5>Hourly Patient Influx Inflow: Current vs Predicted</h5>
              <div style={{ width: '100%', height: 200 }}>
                {forecastMetrics?.chart_data && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={forecastMetrics.chart_data}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3498DB" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3498DB" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#9B59B6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E8ED" />
                      <XAxis dataKey="time" stroke="#7F8C8D" fontSize={11} tickLine={false} />
                      <YAxis stroke="#7F8C8D" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0F1E36', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="Current" stroke="#3498DB" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" name="Current Influx" />
                      <Area type="monotone" dataKey="Predicted" stroke="#9B59B6" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted" />
                      <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#7F8C8D' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default TriageQueueDashboard
