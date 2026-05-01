import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UploadScan from './pages/UploadScan'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h2>🏥 RIS AI Platform</h2>
          </div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/upload">Upload Scan</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/analytics">Analytics</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadScan />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
