import { useState } from 'react'
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
  X
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import RadiologyHub from './pages/RadiologyHub'
import SymptomAnalysis from './pages/SymptomAnalysis'
import PatientManagement from './pages/PatientManagement'
import CareCoordination from './pages/CareCoordination'
import Analytics from './pages/Analytics'
import AISymptomAssessment from './components/AISymptomAssessment'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
          
          <div className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="doctor@hospital.com" defaultValue="demo@healthai.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" defaultValue="demo123" />
            </div>
            
            <button className="login-btn" onClick={() => setLoggedIn(true)}>
              Sign In to Platform
            </button>
            
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            
            <div className="social-login">
              <button className="social-btn">Google</button>
              <button className="social-btn">Microsoft</button>
            </div>
          </div>
          
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

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <Activity size={28} strokeWidth={2.5} />
              {sidebarOpen && <span>HealthAI Pro</span>}
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>
            
            <NavLink to="/radiology" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Scan size={20} />
              {sidebarOpen && <span>Radiology Hub</span>}
            </NavLink>
            
            <NavLink to="/symptom-analysis" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Brain size={20} />
              {sidebarOpen && <span>Symptom Analysis</span>}
            </NavLink>
            
            <NavLink to="/ai-assessment" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Zap size={20} />
              {sidebarOpen && <span>AI Assessment</span>}
            </NavLink>
            
            <NavLink to="/patients" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={20} />
              {sidebarOpen && <span>Patients</span>}
            </NavLink>
            
            <NavLink to="/care-coordination" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Activity size={20} />
              {sidebarOpen && <span>Care Coordination</span>}
            </NavLink>
            
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <BarChart3 size={20} />
              {sidebarOpen && <span>Analytics</span>}
            </NavLink>
          </nav>
          
          <div className="sidebar-footer">
            <button className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              {sidebarOpen && <span>Collapse</span>}
            </button>
            <button className="nav-item" onClick={() => setLoggedIn(false)}>
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/radiology" element={<RadiologyHub />} />
            <Route path="/symptom-analysis" element={<SymptomAnalysis />} />
            <Route path="/ai-assessment" element={<AISymptomAssessment />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/care-coordination" element={<CareCoordination />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
