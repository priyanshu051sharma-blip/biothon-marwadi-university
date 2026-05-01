import { useState } from 'react'
import { Brain, Search, Calendar, MapPin, Star, Clock, Phone, Video, User, CheckCircle, AlertCircle } from 'lucide-react'

function SymptomAnalysis() {
  const [symptoms, setSymptoms] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [bookingModal, setBookingModal] = useState(false)

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Chest Pain',
    'Shortness of Breath', 'Nausea', 'Dizziness', 'Body Ache'
  ]

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return
    
    setAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setResult({
      diagnosis: 'Respiratory Infection',
      confidence: 87.5,
      severity: 'moderate',
      description: 'Based on your symptoms, you may have a respiratory tract infection. Common causes include viral or bacterial infections.',
      recommendations: [
        'Rest and stay hydrated',
        'Monitor temperature regularly',
        'Avoid contact with others',
        'Consult a doctor if symptoms worsen'
      ],
      suggestedDoctors: [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialty: 'Pulmonologist',
          experience: '15 years',
          rating: 4.9,
          reviews: 342,
          hospital: 'City General Hospital',
          location: 'Downtown Medical Center',
          availability: 'Available Today',
          nextSlot: '2:30 PM',
          consultationFee: 500,
          languages: ['English', 'Hindi'],
          image: '👩‍⚕️'
        },
        {
          id: 2,
          name: 'Dr. Rajesh Kumar',
          specialty: 'General Physician',
          experience: '12 years',
          rating: 4.8,
          reviews: 289,
          hospital: 'Apollo Hospital',
          location: 'Sector 15, Medical District',
          availability: 'Available Tomorrow',
          nextSlot: '10:00 AM',
          consultationFee: 400,
          languages: ['English', 'Hindi', 'Tamil'],
          image: '👨‍⚕️'
        },
        {
          id: 3,
          name: 'Dr. Priya Sharma',
          specialty: 'Internal Medicine',
          experience: '10 years',
          rating: 4.7,
          reviews: 215,
          hospital: 'Max Healthcare',
          location: 'North Avenue Medical Complex',
          availability: 'Available Today',
          nextSlot: '4:00 PM',
          consultationFee: 450,
          languages: ['English', 'Hindi'],
          image: '👩‍⚕️'
        }
      ]
    })
    
    setAnalyzing(false)
  }

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setBookingModal(true)
  }

  const confirmBooking = () => {
    alert(`Appointment booked with ${selectedDoctor.name} for ${selectedDoctor.nextSlot}`)
    setBookingModal(false)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
          AI Symptom Analysis
        </h1>
        <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
          Describe your symptoms and get instant AI-powered diagnosis with doctor recommendations
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Input Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain size={20} /> Describe Your Symptoms
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
              What are you experiencing?
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have been experiencing fever, dry cough, and fatigue for the past 3 days..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '14px',
                border: '2px solid #E1E8ED',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D', marginBottom: '12px' }}>
              Common Symptoms (Click to add)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom)}
                  style={{
                    padding: '8px 16px',
                    background: '#F8FAFB',
                    border: '1px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!symptoms.trim() || analyzing}
            style={{
              width: '100%',
              padding: '14px',
              background: (!symptoms.trim() || analyzing) ? '#BDC3C7' : 'linear-gradient(135deg, #1B4F72, #2E86AB)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (!symptoms.trim() || analyzing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {analyzing ? (
              <>
                <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search size={18} />
                Analyze Symptoms
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px' }}>
            Analysis Results
          </h3>

          {!result && !analyzing && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7F8C8D' }}>
              <Brain size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Enter your symptoms and click analyze to see results</p>
            </div>
          )}

          {analyzing && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C3E50' }}>
                AI is analyzing your symptoms...
              </p>
            </div>
          )}

          {result && (
            <div>
              <div style={{
                padding: '20px',
                background: result.severity === 'high' ? '#FFF4E6' : '#FFF9E6',
                borderRadius: '12px',
                marginBottom: '20px',
                border: `2px solid ${result.severity === 'high' ? '#E67E22' : '#F39C12'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <AlertCircle size={20} color="#E67E22" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase' }}>
                    Possible Diagnosis
                  </span>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
                  {result.diagnosis}
                </h4>
                <p style={{ fontSize: '14px', color: '#2C3E50', margin: '0 0 12px 0' }}>
                  {result.description}
                </p>
                <p style={{ fontSize: '13px', color: '#7F8C8D', margin: 0 }}>
                  Confidence: <strong>{result.confidence}%</strong>
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px' }}>
                  Recommendations
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: '#2C3E50', marginBottom: '8px' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Doctors */}
      {result && (
        <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
            Recommended Doctors
          </h3>

          <div style={{ display: 'grid', gap: '20px' }}>
            {result.suggestedDoctors.map((doctor) => (
              <div key={doctor.id} style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '20px',
                padding: '24px',
                background: '#F8FAFB',
                borderRadius: '12px',
                border: '1px solid #E1E8ED',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px'
                }}>
                  {doctor.image}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      {doctor.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#FFF9E6', borderRadius: '6px' }}>
                      <Star size={14} fill="#F39C12" color="#F39C12" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F39C12' }}>
                        {doctor.rating}
                      </span>
                      <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                        ({doctor.reviews})
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#2E86AB', fontWeight: 600, margin: '0 0 8px 0' }}>
                    {doctor.specialty} • {doctor.experience} experience
                  </p>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#7F8C8D" />
                      <span style={{ fontSize: '13px', color: '#7F8C8D' }}>{doctor.hospital}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#27AE60" />
                      <span style={{ fontSize: '13px', color: '#27AE60', fontWeight: 600 }}>
                        {doctor.availability}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#7F8C8D', margin: 0 }}>
                    Next Available: <strong>{doctor.nextSlot}</strong> • Fee: ₹{doctor.consultationFee}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Calendar size={16} />
                    Book Appointment
                  </button>
                  <button style={{
                    padding: '10px 24px',
                    background: 'white',
                    color: '#2E86AB',
                    border: '1px solid #2E86AB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && selectedDoctor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2540', marginBottom: '20px' }}>
              Book Appointment
            </h3>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFB', borderRadius: '12px' }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#0A2540', margin: '0 0 8px 0' }}>
                {selectedDoctor.name}
              </p>
              <p style={{ fontSize: '14px', color: '#7F8C8D', margin: 0 }}>
                {selectedDoctor.specialty} • {selectedDoctor.hospital}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                defaultValue={`2024-01-15T${selectedDoctor.nextSlot}`}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E1E8ED',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                Consultation Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button style={{
                  padding: '12px',
                  background: '#E8F4FD',
                  border: '2px solid #2E86AB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2E86AB',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <User size={16} />
                  In-Person
                </button>
                <button style={{
                  padding: '12px',
                  background: '#F8FAFB',
                  border: '2px solid #E1E8ED',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2C3E50',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Video size={16} />
                  Video Call
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmBooking}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setBookingModal(false)}
                style={{
                  padding: '14px 24px',
                  background: '#F5F7FA',
                  color: '#2C3E50',
                  border: '1px solid #E1E8ED',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomAnalysis
