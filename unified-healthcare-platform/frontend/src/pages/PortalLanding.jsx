import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Building2, Activity, Heart, ArrowRight } from 'lucide-react'
import './PortalLanding.css'

function PortalLanding() {
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('auth-role')
    if (role === 'patient') {
      navigate('/patient')
    } else if (role === 'admin') {
      navigate('/admin')
    }
  }, [navigate])

  return (
    <div className="portal-landing">
      <div className="landing-background">
        <div className="grid-overlay"></div>
        <div className="radial-glow glow-1"></div>
        <div className="radial-glow glow-2"></div>
      </div>

      <div className="landing-content">
        <header className="landing-header">
          <div className="logo-section">
            <Activity size={36} color="#3498DB" className="pulse-icon" />
            <h1>HealthAI Pro</h1>
          </div>
          <span className="platform-tagline">Integrated Emergency Triage & Resource Coordination Ecosystem</span>
        </header>

        <div className="portal-cards-grid">
          {/* Patient Portal Card */}
          <div className="portal-card patient-card" onClick={() => navigate('/patient')}>
            <div className="card-badge">FOR PATIENTS</div>
            <div className="card-icon-wrap">
              <Heart size={38} className="heart-icon" />
            </div>
            <h2>Patient Health Portal</h2>
            <p>Describe symptoms for AI triage, check queue position, book consultations, and view your digital twin health records.</p>
            <ul className="portal-features">
              <li>✓ Interactive AI Symptom Checker</li>
              <li>✓ Live Priority Queue Token Tracking</li>
              <li>✓ Custom Doctor & Ward Bookings</li>
              <li>✓ Multilingual & Voice Accessibility</li>
            </ul>
            <div className="card-action">
              <span>Access Portal</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Hospital/Admin Portal Card */}
          <div className="portal-card admin-card" onClick={() => navigate('/admin')}>
            <div className="card-badge admin">FOR CLINICIANS & STAFF</div>
            <div className="card-icon-wrap">
              <Building2 size={38} className="hospital-icon" />
            </div>
            <h2>Hospital Operations Center</h2>
            <p>Manage incoming triage emergencies, allocate ICU beds, review AI radiology scan heatmaps, and audit network inventories.</p>
            <ul className="portal-features">
              <li>✓ Real-Time Smart Priority Queue</li>
              <li>✓ Explainable AI (XAI) Radiology Hub</li>
              <li>✓ Cross-Hospital Bed & Blood Banks</li>
              <li>✓ Predictive Analytics Forecasts</li>
            </ul>
            <div className="card-action">
              <span>Enter Command Center</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>All Backend Services & AI Triage Agents Operational</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default PortalLanding
