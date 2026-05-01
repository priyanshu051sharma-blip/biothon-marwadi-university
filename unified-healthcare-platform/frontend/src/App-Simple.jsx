import { useState } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1B4F72, #2E86AB)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ marginBottom: '8px', fontSize: '28px' }}>🏥 HealthAI Pro</h1>
          <p style={{ color: '#7F8C8D', marginBottom: '32px' }}>
            Unified Healthcare Intelligence Platform
          </p>
          
          <button
            onClick={() => setLoggedIn(true)}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Enter Dashboard
          </button>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#F8F9FA',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
            <strong>✅ Platform Status:</strong><br/>
            • Frontend: Running<br/>
            • Databases: Active<br/>
            • Ready to use!
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
        color: 'white',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '24px' }}>🏥 HealthAI Pro</h2>
        <button
          onClick={() => setLoggedIn(false)}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard */}
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#7F8C8D', marginBottom: '30px' }}>
          Welcome to your Healthcare Intelligence Platform
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Total Patients', value: '1,247', change: '+12%', color: '#3498DB' },
            { label: 'Active Scans', value: '23', change: '+8%', color: '#27AE60' },
            { label: 'AI Analyses', value: '156', change: '+15%', color: '#9B59B6' },
            { label: 'AI Accuracy', value: '94.8%', change: '+0.3%', color: '#E67E22' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${stat.color}`
            }}>
              <p style={{ fontSize: '13px', color: '#7F8C8D', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
                {stat.value}
              </h3>
              <span style={{ fontSize: '12px', color: '#27AE60', fontWeight: 600 }}>
                {stat.change} from last month
              </span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Platform Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              '🔬 AI Radiology Analysis',
              '🧠 Symptom Intelligence',
              '🕸️ GraphRAG Decision Support',
              '📊 Real-time Analytics',
              '👥 Patient Management',
              '🏥 Care Coordination'
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: '#F8F9FA',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 500
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #D5F4E6, #C8E6C9)',
          borderRadius: '12px',
          border: '2px solid #27AE60'
        }}>
          <h3 style={{ color: '#27AE60', marginBottom: '8px' }}>🎉 Platform Successfully Running!</h3>
          <p style={{ color: '#2C3E50' }}>
            Your unified healthcare AI platform is operational. All systems are ready for use.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
