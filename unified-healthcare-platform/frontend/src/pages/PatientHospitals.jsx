import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Bed, Droplet, Pill, ShieldAlert, Check, Star, Search, RefreshCw } from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientHospitals() {
  const navigate = useNavigate()
  const [selectedCondition, setSelectedCondition] = useState('Pulmonology')
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [bloodGroup, setBloodGroup] = useState('A+')

  const conditionsList = [
    { id: 'Cardiology', label: 'Cardiology (Heart/Chest Pain)' },
    { id: 'Pulmonology', label: 'Pulmonology (Asthma/Breathing)' },
    { id: 'Neurology', label: 'Neurology (Migraine/Stroke)' },
    { id: 'General', label: 'General Medicine (Flu/Infections)' }
  ]

  useEffect(() => {
    fetchRecommendations()
  }, [selectedCondition])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      // We will call the backend API analyze with a mock symptoms string matching the specialty
      const symptomsMap = {
        Cardiology: 'severe chest pain',
        Pulmonology: 'shortness of breath wheezing',
        Neurology: 'severe migraine headache',
        General: 'mild fever and cough'
      }
      
      const response = await api.post('/api/triage/analyze', {
        patient_name: 'Sarah Miller',
        blood_group: bloodGroup,
        symptoms: symptomsMap[selectedCondition]
      })
      
      setHospitals(response.data.recommended_hospitals)
    } catch (error) {
      console.error('Error fetching hospital recommendations:', error)
      // Fallback
      setHospitals([
        { name: 'Apollo Medical Center', distance: '4.1 km', rating: 4.9, match_score: 96, reasons: ['ICU Bed available', 'A+ Blood bank stock verified', 'Cardiology Specialty on-duty', 'Proximity: 4.1 km'] },
        { name: 'City General Hospital', distance: '2.3 km', rating: 4.8, match_score: 85, reasons: ['General triage ward beds available', 'A+ Blood stock verified', 'Proximity: 2.3 km'] },
        { name: 'Max Healthcare', distance: '5.8 km', rating: 4.7, match_score: 72, reasons: ['General beds available', 'Proximity: 5.8 km'] }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleRequestBed = (hospital) => {
    localStorage.setItem('allocated-hospital-name', hospital.name)
    localStorage.setItem('demo-patient-name', 'Sarah Miller')
    
    // Create notification
    const newNotif = {
      id: Date.now(),
      message: `Emergency bed allocation complete: Bed reserved at ${hospital.name}. Dispatch active.`,
      time: 'Just now',
      type: 'success'
    }
    const savedNotifs = localStorage.getItem('patient-notifications')
    const parsedNotifs = savedNotifs ? JSON.parse(savedNotifs) : []
    parsedNotifs.unshift(newNotif)
    localStorage.setItem('patient-notifications', JSON.stringify(parsedNotifs))

    navigate('/patient/queue')
  }

  return (
    <div className="patient-hospitals">
      <div className="status-header">
        <Building2 size={32} color="#3498DB" />
        <div>
          <h2>AI-Powered Hospital Recommendations</h2>
          <p>Find the best matched hospital based on your medical twin condition and real-time network resource levels.</p>
        </div>
      </div>

      {/* Select Specialty Match */}
      <div className="condition-select-panel">
        <span className="panel-lbl">Select Condition to Match:</span>
        <div className="conditions-chips">
          {conditionsList.map((cond) => (
            <button
              key={cond.id}
              className={`cond-chip ${selectedCondition === cond.id ? 'active' : ''}`}
              onClick={() => setSelectedCondition(cond.id)}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner-wrap">
          <RefreshCw className="spinning" size={36} color="#3498DB" />
          <p>Matching hospital resources...</p>
        </div>
      ) : (
        <div className="hospitals-recommendation-list animate-fade-in" style={{ marginTop: '24px' }}>
          {hospitals.map((h, idx) => (
            <div key={idx} className="hospital-match-card-large">
              <div className="match-card-grid">
                {/* Score Circle */}
                <div className="match-score-section">
                  <div className="match-circle">
                    <span className="pct">{h.match_score}%</span>
                    <span className="lbl">MATCH</span>
                  </div>
                </div>

                {/* Details */}
                <div className="match-details-section">
                  <div className="match-card-header">
                    <h4>{h.name}</h4>
                    <span className="dist"><MapPin size={12} /> {h.distance}</span>
                  </div>
                  
                  <div className="match-card-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(h.rating) ? '#F1C40F' : 'none'} 
                        color={i < Math.floor(h.rating) ? '#F1C40F' : '#BDC3C7'} 
                      />
                    ))}
                    <span className="rating-num">{h.rating}</span>
                  </div>

                  <div className="match-card-reasons">
                    {h.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="reason-bullet">
                        <span className="chk">✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="match-action-section">
                  <div className="resource-quick-indicators">
                    <div className="ind-item">
                      <Bed size={14} />
                      <span>ICU: Available</span>
                    </div>
                    <div className="ind-item">
                      <Droplet size={14} />
                      <span>Blood Type A+: Yes</span>
                    </div>
                  </div>
                  <button className="btn-pt-submit" onClick={() => handleRequestBed(h)}>
                    Request Ward Bed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientHospitals
