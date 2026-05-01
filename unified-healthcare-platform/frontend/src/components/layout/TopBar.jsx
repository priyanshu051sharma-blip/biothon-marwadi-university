import { useState } from 'react'
import { Search, Bell, Mic, Settings } from 'lucide-react'
import './TopBar.css'

function TopBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    { id: 1, type: 'urgent', message: 'Critical: Patient P-001 requires immediate attention', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New radiology report available for review', time: '15 min ago' },
    { id: 3, type: 'success', message: 'AI model updated successfully', time: '1 hour ago' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }
      
      recognition.start()
    }
  }

  return (
    <div className="top-bar">
      <div className="search-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search patients, reports, symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="voice-search-btn" onClick={handleVoiceSearch}>
            <Mic size={18} />
          </button>
        </div>
      </div>

      <div className="top-bar-actions">
        <div className="notification-wrapper">
          <button 
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                <button className="mark-read-btn">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.type}`}>
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn">
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}

export default TopBar
