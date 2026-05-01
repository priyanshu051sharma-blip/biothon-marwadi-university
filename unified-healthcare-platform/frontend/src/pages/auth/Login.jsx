import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

function Login() {
  const [email, setEmail] = useState('admin@healthai.com')
  const [password, setPassword] = useState('admin123')
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mock login
    login({
      id: '1',
      name: 'Dr. Admin',
      email: email,
      role: 'admin'
    })
    
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Sign in to HealthAI Pro
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            Sign In
          </button>
        </form>
        
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Email: admin@healthai.com<br/>
          Password: admin123
        </div>
      </div>
    </div>
  )
}

export default Login
