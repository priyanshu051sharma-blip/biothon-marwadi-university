import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Scan, 
  Stethoscope, 
  Calendar,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import './Sidebar.css'

function Sidebar() {
  const { logout, user } = useAuthStore()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/radiology', icon: Scan, label: 'Radiology' },
    { path: '/symptoms', icon: Stethoscope, label: 'Symptom Analysis' },
    { path: '/care', icon: Calendar, label: 'Care Coordination' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">HealthAI Pro</span>
        </div>
        <p className="tagline">Unified Healthcare Intelligence</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt="Profile"
            className="user-avatar"
          />
          <div className="user-info">
            <p className="user-name">{user?.name || 'Dr. User'}</p>
            <p className="user-role">{user?.role || 'Doctor'}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
