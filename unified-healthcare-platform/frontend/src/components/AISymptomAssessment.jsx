import { useState, useEffect, useRef } from 'react'
import { 
  Brain, 
  Stethoscope, 
  Pill, 
  Droplet,
  Volume2,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  FileText,
  PhoneCall,
  Calendar
} from 'lucide-react'
import api from '../services/api'
import './AISymptomAssessment.css'

function AISymptomAssessment() {
  const [language, setLanguage] = useState('en')
  const [currentStep, setCurrentStep] = useState('input') // input, questioning, analysis, results
  const [symptomInput, setSymptomInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questionnaireResponses, setQuestionnaireResponses] = useState({})
  const [lifeStyleResponses, setLifeStyleResponses] = useState({})
  const [diseaseResults, setDiseaseResults] = useState([])
  const [doctorResults, setDoctorResults] = useState([])
  const [medicineResults, setMedicineResults] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState(null)
  const synthesisRef = useRef(null)
  const [supportedLanguages, setSupportedLanguages] = useState([])
  const [showMedicines, setShowMedicines] = useState(false)
  const [selectedAppointmentDoctor, setSelectedAppointmentDoctor] = useState(null)

  const translations = {
    en: {
      title: 'AI-Powered Symptom Assessment',
      subtitle: 'Advanced health diagnosis with doctor & medicine finder',
      selectLanguage: 'Select Language',
      startAssessment: 'Start Assessment',
      describeSymptomsPlaceholder: 'E.g., "I have chest pain, shortness of breath, and fatigue"',
      next: 'Next',
      previous: 'Previous',
      submit: 'Analyze Symptoms',
      lifeStyleQuestions: 'Health & Lifestyle Questions',
      analysisInProgress: 'Analyzing symptoms...',
      results: 'Assessment Results',
      diagnosticResults: 'Diagnostic Results',
      recommendedDoctors: 'Recommended Doctors',
      recommendedMedicines: 'Recommended Medicines',
      bloodBankFinder: 'Blood Bank Finder',
      bookAppointment: 'Book Appointment',
      emergencyAlert: 'Emergency - Call Ambulance Now!',
      consultDoctor: 'Consult Doctor Soon',
      scheduleCheckup: 'Schedule Regular Checkup',
      readAloud: 'Read Aloud',
      stop: 'Stop',
      rating: 'Rating',
      experience: 'Experience',
      consultationFee: 'Consultation Fee',
      available: 'Available From',
      sleepHours: 'Hours of sleep per night',
      diet: 'Diet type',
      waterIntake: 'Water intake (cups/day)',
      exercise: 'Exercise frequency (times/week)',
      smoker: 'Do you smoke?',
      alcoholWeekly: 'Alcohol consumption (units/week)',
      stressLevel: 'Stress level',
      chronicDiseases: 'Any chronic diseases?',
      medications: 'Current medications',
      noResults: 'No results found',
      tryAgain: 'Try again',
      confidence: 'Confidence',
      urgency: 'Urgency',
      description: 'Description',
      specialists: 'Specialists',
      treatments: 'Treatment Options',
      matchingSymptoms: 'Matching Symptoms',
      genericName: 'Generic Name',
      brandNames: 'Brand Names',
      dosage: 'Dosage',
      price: 'Price',
      seeMore: 'See More',
      seeLess: 'See Less',
      selectSlot: 'Select Appointment Slot',
      confirmBooking: 'Confirm Booking',
      appointmentBooked: 'Appointment Booked Successfully!',
      appointmentID: 'Appointment ID',
      instructions: 'Please arrive 10 minutes early and bring your medical reports',
    },
    hi: {
      title: 'एआई-संचालित लक्षण मूल्यांकन',
      subtitle: 'डॉक्टर और दवा फाइंडर के साथ उन्नत स्वास्थ्य निदान',
      selectLanguage: 'भाषा चुनें',
      startAssessment: 'मूल्यांकन शुरू करें',
      describeSymptomsPlaceholder: 'उदा। "मुझे सीने में दर्द, सांस लेने में तकलीफ और थकान है"',
      next: 'अगला',
      previous: 'पिछला',
      submit: 'लक्षणों का विश्लेषण करें',
      lifeStyleQuestions: 'स्वास्थ्य और जीवनशैली के प्रश्न',
      analysisInProgress: 'लक्षणों का विश्लेषण जारी है...',
      results: 'मूल्यांकन परिणाम',
      diagnosticResults: 'निदान परिणाम',
      recommendedDoctors: 'अनुशंसित डॉक्टर',
      recommendedMedicines: 'अनुशंसित दवाएं',
      bloodBankFinder: 'रक्त बैंक फाइंडर',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      emergencyAlert: 'आपातकाल - तुरंत एम्बुलेंस बुलाएं!',
      consultDoctor: 'जल्द ही डॉक्टर से सलाह लें',
      scheduleCheckup: 'नियमित जांच शेड्यूल करें',
      readAloud: 'जोर से पढ़ें',
      stop: 'रोकें',
    },
    mr: {
      title: 'एआই-संचालित लक्षण मूल्यांकन',
      subtitle: 'डॉक्टर आणि औषध शोधक सह उन्नत आरोग्य निदान',
      selectLanguage: 'भाषा निवडा',
      startAssessment: 'मूल्यांकन सुरु करा',
      describeSymptomsPlaceholder: 'उदा. "मला छातीत दुखणे, श्वसन कष्ट आणि थकवा आहे"',
      submit: 'लक्षणांचे विश्लेषण करा',
      recommendedDoctors: 'सुचवलेले डॉक्टर',
    },
    gu: {
      title: 'AI-સંચાલિત લક્ષણ મૂલ્યાંકન',
      subtitle: 'ડૉક્ટર અને દવા ફાઇન્ડર સાથે અદ્યતન આરોગ્ય નિદાન',
      selectLanguage: 'ભાષા પસંદ કરો',
      startAssessment: 'મૂલ્યાંકન શરૂ કરો',
      describeSymptomsPlaceholder: 'ઉદા. "મને છાતીમાં દુખાવો, શ્વાસમાં તકલીફ અને કમજોરી છે"',
      submit: 'લક્ષણોનું વિશ્લેષણ કરો',
    },
  }

  const lifeStyleQuestions = [
    { key: 'sleep_hours', label: translations[language].sleepHours, type: 'number', min: 0, max: 12 },
    { key: 'diet', label: translations[language].diet, type: 'select', options: ['balanced', 'mostly_junk', 'vegetarian', 'non_vegetarian'] },
    { key: 'water_intake', label: translations[language].waterIntake, type: 'number', min: 0, max: 10 },
    { key: 'exercise_frequency', label: translations[language].exercise, type: 'number', min: 0, max: 7 },
    { key: 'smoker', label: translations[language].smoker, type: 'select', options: ['yes', 'no'] },
    { key: 'alcohol_weekly', label: translations[language].alcoholWeekly, type: 'number', min: 0, max: 40 },
    { key: 'stress_level', label: translations[language].stressLevel, type: 'select', options: ['low', 'medium', 'high'] },
  ]

  useEffect(() => {
    // Get supported languages
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/api/translations/supported-languages')
        setSupportedLanguages(response.data.supported_languages || [])
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = `${language}-IN`
      setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStartAssessment = () => {
    if (!symptomInput.trim()) {
      alert('Please describe your symptoms')
      return
    }
    setCurrentStep('questioning')
  }

  const handleLifeStyleAnswer = (key, value) => {
    setLifeStyleResponses({ ...lifeStyleResponses, [key]: value })
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      // Create symptom profile
      const symptomProfile = {}
      // Parse symptoms and create severity scores
      const symptoms = symptomInput.toLowerCase().split(',').map(s => s.trim())
      symptoms.forEach(symptom => {
        const commonSymptoms = ['chest pain', 'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness', 'shortness of breath']
        commonSymptoms.forEach(cs => {
          if (symptom.includes(cs)) {
            symptomProfile[cs.replace(' ', '_')] = 7 // Default severity 7/10
          }
        })
      })

      // Get disease predictions
      const diseaseResponse = await api.post('/api/diseases/predict', {
        symptom_profile: symptomProfile,
        lifestyle_factors: lifeStyleResponses
      })
      setDiseaseResults(diseaseResponse.data.predictions)

      // Get doctors if disease found
      if (diseaseResponse.data.predictions.length > 0) {
        const topDisease = diseaseResponse.data.predictions[0].disease
        setSelectedDisease(topDisease)
        const doctorResponse = await api.post('/api/doctors/search', { disease: topDisease })
        setDoctorResults(doctorResponse.data.recommended_doctors)

        // Get medicines
        const medicineResponse = await api.post('/api/medicines/for-disease', topDisease)
        setMedicineResults(medicineResponse.data.recommended_medicines)
      }

      setCurrentStep('results')
    } catch (error) {
      console.error('Error during analysis:', error)
      alert('Error analyzing symptoms. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return '#E74C3C'
      case 'urgent':
        return '#E67E22'
      case 'moderate':
        return '#F39C12'
      default:
        return '#27AE60'
    }
  }

  const getUrgencyLabel = (urgency) => {
    const labels = {
      emergency: translations[language].emergencyAlert,
      urgent: translations[language].consultDoctor,
      moderate: translations[language].scheduleCheckup,
      'non-urgent': translations[language].scheduleCheckup,
    }
    return labels[urgency] || urgency
  }

  return (
    <div className="ai-symptom-assessment">
      {/* Header */}
      <div className="assessment-header">
        <div className="header-content">
          <div className="header-title">
            <Brain size={32} color="#3498DB" />
            <div>
              <h1>{translations[language]?.title || 'AI-Powered Symptom Assessment'}</h1>
              <p>{translations[language]?.subtitle || 'Advanced health diagnosis with doctor & medicine finder'}</p>
            </div>
          </div>
          <div className="language-selector">
            <label>{translations[language]?.selectLanguage || 'Select Language'}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="assessment-content">
        {currentStep === 'input' && (
          <div className="input-section">
            <div className="input-card">
              <h2>{translations[language]?.describeSymptomsPlaceholder?.split('E.g.')[0].trim()}</h2>
              <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder={translations[language]?.describeSymptomsPlaceholder}
                className="symptoms-input"
                rows="6"
              />
              <button onClick={handleStartAssessment} className="btn-primary">
                {translations[language]?.startAssessment}
              </button>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <Stethoscope size={24} />
                <h3>Doctor Match</h3>
                <p>Find specialists best suited for your condition</p>
              </div>
              <div className="info-card">
                <Pill size={24} />
                <h3>Medicine Finder</h3>
                <p>Get medicine info, pricing & availability</p>
              </div>
              <div className="info-card">
                <Droplet size={24} />
                <h3>Blood Banks</h3>
                <p>Find nearby blood banks & reserve blood</p>
              </div>
              <div className="info-card">
                <Volume2 size={24} />
                <h3>Accessible</h3>
                <p>Multi-language & text-to-speech support</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'questioning' && (
          <div className="questioning-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / lifeStyleQuestions.length) * 100}%` }}></div>
            </div>
            <div className="question-card">
              <h2>{translations[language]?.lifeStyleQuestions}</h2>
              <p className="question-counter">
                {translations[language]?.next} {currentQuestion + 1} {translations[language]?.previous} {lifeStyleQuestions.length}
              </p>

              <div className="question-content">
                <label className="question-label">{lifeStyleQuestions[currentQuestion].label}</label>
                {lifeStyleQuestions[currentQuestion].type === 'number' && (
                  <input
                    type="range"
                    min={lifeStyleQuestions[currentQuestion].min}
                    max={lifeStyleQuestions[currentQuestion].max}
                    value={lifeStyleResponses[lifeStyleQuestions[currentQuestion].key] || 0}
                    onChange={(e) => handleLifeStyleAnswer(lifeStyleQuestions[currentQuestion].key, e.target.value)}
                    className="slider-input"
                  />
                )}
                {lifeStyleQuestions[currentQuestion].type === 'select' && (
                  <select
                    value={lifeStyleResponses[lifeStyleQuestions[currentQuestion].key] || ''}
                    onChange={(e) => handleLifeStyleAnswer(lifeStyleQuestions[currentQuestion].key, e.target.value)}
                    className="select-input"
                  >
                    <option value="">Select...</option>
                    {lifeStyleQuestions[currentQuestion].options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="button-group">
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="btn-secondary"
                  >
                    {translations[language]?.previous}
                  </button>
                )}
                {currentQuestion < lifeStyleQuestions.length - 1 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="btn-primary"
                  >
                    {translations[language]?.next}
                  </button>
                )}
                {currentQuestion === lifeStyleQuestions.length - 1 && (
                  <button onClick={handleAnalyze} className="btn-success" disabled={isLoading}>
                    {isLoading ? translations[language]?.analysisInProgress : translations[language]?.submit}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="results-section">
            {/* Disease Predictions */}
            <div className="results-card">
              <div className="results-header">
                <Brain size={24} />
                <h2>{translations[language]?.diagnosticResults}</h2>
              </div>

              {diseaseResults.length > 0 ? (
                <div className="disease-results">
                  {diseaseResults.map((disease, idx) => (
                    <div
                      key={idx}
                      className="disease-result-item"
                      style={{ borderLeftColor: getUrgencyColor(disease.urgency) }}
                    >
                      <div className="disease-header">
                        <div className="disease-name">
                          <h3>{disease.name}</h3>
                          <span className="confidence-badge">{disease.confidence.toFixed(1)}% confidence</span>
                        </div>
                        <AlertTriangle size={20} color={getUrgencyColor(disease.urgency)} />
                      </div>
                      <p className="disease-description">{disease.description}</p>
                      <div className="urgency-banner" style={{ backgroundColor: getUrgencyColor(disease.urgency) }}>
                        {getUrgencyLabel(disease.urgency)}
                      </div>
                      <div className="disease-details">
                        <div className="detail-item">
                          <strong>Matching Symptoms:</strong>
                          {disease.matching_symptoms.join(', ')}
                        </div>
                        <div className="detail-item">
                          <strong>Specialists:</strong>
                          {disease.specialists.join(', ')}
                        </div>
                      </div>
                      <button
                        className="btn-tts"
                        onClick={() => speakText(disease.description)}
                        disabled={isSpeaking}
                      >
                        <Volume2 size={16} />
                        {isSpeaking ? translations[language]?.stop : translations[language]?.readAloud}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{translations[language]?.noResults}</p>
              )}
            </div>

            {/* Recommended Doctors */}
            {doctorResults.length > 0 && (
              <div className="results-card">
                <div className="results-header">
                  <Stethoscope size={24} />
                  <h2>{translations[language]?.recommendedDoctors}</h2>
                </div>
                <div className="doctors-grid">
                  {doctorResults.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-header">
                        <h3>{doctor.name}</h3>
                        <div className="doctor-rating">
                          {'⭐'.repeat(Math.round(doctor.rating))} {doctor.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="doctor-info">
                        <p className="spec">{doctor.specialization}</p>
                        <p className="exp">
                          <Clock size={14} /> {doctor.experience} years experience
                        </p>
                        <p className="hospital">{doctor.hospital}</p>
                        <p className="location">
                          <MapPin size={14} /> {doctor.location}
                        </p>
                        <p className="fee">
                          <strong>₹{doctor.consultation_fee}</strong> per consultation
                        </p>
                        <p className="languages">
                          <Globe size={14} /> {doctor.languages.join(', ')}
                        </p>
                      </div>
                      <button
                        className="btn-book"
                        onClick={() => setSelectedAppointmentDoctor(doctor)}
                      >
                        {translations[language]?.bookAppointment}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Medicines */}
            {medicineResults.length > 0 && (
              <div className="results-card">
                <div className="results-header">
                  <Pill size={24} />
                  <h2>{translations[language]?.recommendedMedicines}</h2>
                  <button
                    className="btn-expand"
                    onClick={() => setShowMedicines(!showMedicines)}
                  >
                    {showMedicines ? '−' : '+'}
                  </button>
                </div>
                {showMedicines && (
                  <div className="medicines-list">
                    {medicineResults.map((medicine, idx) => (
                      <div key={idx} className="medicine-item">
                        <h4>{medicine.generic_name}</h4>
                        <p className="brands">
                          <strong>Brands:</strong> {medicine.brand_names.join(', ')}
                        </p>
                        <p>
                          <strong>Dosage:</strong> {medicine.recommended_dosage}
                        </p>
                        <p>
                          <strong>Duration:</strong> {medicine.duration}
                        </p>
                        <p className="price">
                          <strong>Price Range:</strong> ₹{medicine.price_range[0]} - ₹{medicine.price_range[1]}
                        </p>
                        {medicine.requires_prescription && (
                          <span className="badge-prescription">Prescription Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button className="btn-restart" onClick={() => {
              setCurrentStep('input')
              setSymptomInput('')
              setQuestionnaireResponses({})
              setLifeStyleResponses({})
              setDiseaseResults([])
              setDoctorResults([])
              setMedicineResults([])
              setCurrentQuestion(0)
            }}>
              Start New Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISymptomAssessment
