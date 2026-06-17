import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Scan, 
  Brain, 
  Users, 
  Activity, 
  BarChart3,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Flame,
  Heart,
  Building2,
  Clock,
  Calendar,
  FileText,
  Bell,
  ArrowLeftRight,
  MessageSquare
} from 'lucide-react'

// Existing Admin/Clinician components
import Dashboard from './pages/Dashboard'
import RadiologyHub from './pages/RadiologyHub'
import SymptomAnalysis from './pages/SymptomAnalysis'
import PatientManagement from './pages/PatientManagement'
import CareCoordination from './pages/CareCoordination'
import Analytics from './pages/Analytics'
import AISymptomAssessment from './components/AISymptomAssessment'
import TriageQueueDashboard from './pages/TriageQueueDashboard'

// New Patient Portal components
import PortalLanding from './pages/PortalLanding'
import PatientDashboard from './pages/PatientDashboard'
import PatientSymptomChecker from './pages/PatientSymptomChecker'
import PatientHospitals from './pages/PatientHospitals'
import PatientQueueStatus from './pages/PatientQueueStatus'
import PatientAppointments from './pages/PatientAppointments'
import PatientMedicalRecords from './pages/PatientMedicalRecords'
import PatientNotifications from './pages/PatientNotifications'
import PatientChatbot from './pages/PatientChatbot'

import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('auth-session') === 'true'
  })
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar-open')
    return saved !== null ? saved === 'true' : true
  })
  const [email, setEmail] = useState('doctor@healthai.com')
  const [password, setPassword] = useState('demo123')

  // Persist login state
  useEffect(() => {
    localStorage.setItem('auth-session', loggedIn.toString())
  }, [loggedIn])

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-open', sidebarOpen.toString())
  }, [sidebarOpen])

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      alert('Please fill in your credentials')
      return
    }

    const emailLower = email.toLowerCase().trim()
    let detectedRole = 'admin'
    if (emailLower.includes('patient') || emailLower.includes('sarah') || emailLower.includes('user')) {
      detectedRole = 'patient'
    }

    // Save session
    localStorage.setItem('auth-session', 'true')
    localStorage.setItem('auth-role', detectedRole)
    setLoggedIn(true)
    
    // Redirect to the appropriate portal
    window.location.href = detectedRole === 'patient' ? '/patient' : '/admin'
  }

  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="login-overlay"></div>
        </div>
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">
                <Activity size={32} strokeWidth={2.5} />
              </div>
              <h1>HealthAI Pro</h1>
            </div>
            <p className="login-subtitle">Enterprise Healthcare Intelligence Platform</p>
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="doctor@hospital.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Sign In to Platform
            </button>
            
            <div className="demo-credentials-hints" style={{ marginTop: '16px', fontSize: '11.5px', color: '#7F8C8D', textAlign: 'center', lineHeight: '1.6' }}>
              <div><strong>Demo Patient:</strong> <span style={{ color: '#2E86AB', cursor: 'pointer' }} onClick={() => setEmail('patient@healthai.com')}>patient@healthai.com</span> | demo123</div>
              <div style={{ marginTop: '4px' }}><strong>Demo Clinician:</strong> <span style={{ color: '#9B59B6', cursor: 'pointer' }} onClick={() => setEmail('doctor@healthai.com')}>doctor@healthai.com</span> | demo123</div>
            </div>
            
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="social-btn">Google</button>
              <button type="button" className="social-btn">Microsoft</button>
            </div>
          </form>
          
          <div className="platform-status">
            <div className="status-header">
              <span className="status-indicator"></span>
              <strong>All Systems Operational</strong>
            </div>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-dot green"></span>
                <span>AI Models</span>
              </div>
              <div className="status-item">
                <span className="status-dot green"></span>
                <span>Database</span>
              </div>
              <div className="status-item">
                <span className="status-dot green"></span>
                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-session')
    localStorage.removeItem('auth-role')
    setLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortalLanding />} />
        <Route 
          path="/patient/*" 
          element={
            <PatientPortalLayout 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              handleLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <HospitalPortalLayout 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              handleLogout={handleLogout} 
            />
          } 
        />
      </Routes>
    </Router>
  )
}

/* ============================================================
   PATIENT PORTAL ROUTING LAYOUT
   ============================================================ */
function PatientPortalLayout({ sidebarOpen, setSidebarOpen, handleLogout }) {
  return (
    <div className="app-container">
      {/* Patient Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Heart size={28} strokeWidth={2.5} color="#3498DB" />
            {sidebarOpen && <span>HealthAI Patient</span>}
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/patient" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/patient/symptoms" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Brain size={20} />
            {sidebarOpen && <span>Symptom Checker</span>}
          </NavLink>
          
          <NavLink to="/patient/chat" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <MessageSquare size={20} />
            {sidebarOpen && <span>Health Assistant</span>}
          </NavLink>
          
          <NavLink to="/patient/hospitals" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Building2 size={20} />
            {sidebarOpen && <span>Hospitals</span>}
          </NavLink>
          
          <NavLink to="/patient/queue" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Clock size={20} />
            {sidebarOpen && <span>Queue Status</span>}
          </NavLink>
          
          <NavLink to="/patient/appointments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Calendar size={20} />
            {sidebarOpen && <span>Appointments</span>}
          </NavLink>
          
          <NavLink to="/patient/records" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} />
            {sidebarOpen && <span>Medical Records</span>}
          </NavLink>
          
          <NavLink to="/patient/notifications" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Bell size={20} />
            {sidebarOpen && <span>Notifications</span>}
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Router */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="/symptoms" element={<PatientSymptomChecker />} />
          <Route path="/chat" element={<PatientChatbot />} />
          <Route path="/hospitals" element={<PatientHospitals />} />
          <Route path="/queue" element={<PatientQueueStatus />} />
          <Route path="/appointments" element={<PatientAppointments />} />
          <Route path="/records" element={<PatientMedicalRecords />} />
          <Route path="/notifications" element={<PatientNotifications />} />
        </Routes>
      </main>
    </div>
  )
}

/* ============================================================
   HOSPITAL OPERATIONS PORTAL ROUTING LAYOUT
   ============================================================ */
function HospitalPortalLayout({ sidebarOpen, setSidebarOpen, handleLogout }) {
  return (
    <div className="app-container">
      {/* Admin Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Activity size={28} strokeWidth={2.5} color="#9B59B6" />
            {sidebarOpen && <span>Ops Center</span>}
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/admin/triage" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Flame size={20} />
            {sidebarOpen && <span>Emergency Triage</span>}
          </NavLink>
          
          <NavLink to="/admin/queue" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Clock size={20} />
            {sidebarOpen && <span>Queue Management</span>}
          </NavLink>
          
          <NavLink to="/admin/patients" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} />
            {sidebarOpen && <span>Patients</span>}
          </NavLink>
          
          <NavLink to="/admin/coordination" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} />
            {sidebarOpen && <span>Care Coordination</span>}
          </NavLink>
          
          <NavLink to="/admin/radiology" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Scan size={20} />
            {sidebarOpen && <span>Radiology Hub</span>}
          </NavLink>
          
          <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart3 size={20} />
            {sidebarOpen && <span>Analytics</span>}
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Router */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/triage" element={<TriageQueueDashboard />} />
          <Route path="/queue" element={<TriageQueueDashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/coordination" element={<CareCoordination />} />
          <Route path="/radiology" element={<RadiologyHub />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
