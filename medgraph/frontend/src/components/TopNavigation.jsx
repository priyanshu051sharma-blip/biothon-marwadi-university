import { useState } from 'react'
import { Search, Mic, Bell, User, Stethoscope } from 'lucide-react'
import './TopNavigation.css'

function TopNavigation({ mode, setMode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [alerts] = useState([
    { id: 1, type: 'emergency', message: 'High blood pressure detected - 165/95', time: '5 min ago' },
    { id: 2, type: 'reminder', message: 'Annual checkup due next week', time: '2 hours ago' }
  ])

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }
      
      recognition.start()
    }
  }

  return (
    <nav className="top-navigation">
      <div className="nav-brand">
        <div className="logo">
          <span className="logo-icon">🧬</span>
          <span className="logo-text">MedGraph AI</span>
        </div>
        <span className="tagline">GraphRAG-Powered Healthcare Intelligence</span>
      </div>

      <div className="global-search">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search symptoms, diseases, doctors, hospitals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceInput}
        >
          <Mic size={18} />
        </button>
      </div>

      <div className="nav-actions">
        <div className="alert-center">
          <Bell size={20} />
          {alerts.length > 0 && <span className="alert-badge">{alerts.length}</span>}
        </div>

        <div className="mode-switch">
          <button
            className={mode === 'patient' ? 'active' : ''}
            onClick={() => setMode('patient')}
          >
            <User size={18} />
            Patient
          </button>
          <button
            className={mode === 'doctor' ? 'active' : ''}
            onClick={() => setMode('doctor')}
          >
            <Stethoscope size={18} />
            Doctor
          </button>
        </div>

        <div className="profile-menu">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
        </div>
      </div>
    </nav>
  )
}

export default TopNavigation
