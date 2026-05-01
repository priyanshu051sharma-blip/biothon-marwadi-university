import { useState, useEffect } from 'react'
import { Activity, Users, FileText, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 1247,
    pendingReports: 23,
    activePatients: 156,
    accuracy: 94.8
  })

  const chartData = [
    { name: 'Mon', scans: 45 },
    { name: 'Tue', scans: 52 },
    { name: 'Wed', scans: 48 },
    { name: 'Thu', scans: 61 },
    { name: 'Fri', scans: 55 },
    { name: 'Sat', scans: 38 },
    { name: 'Sun', scans: 42 }
  ]

  const recentCases = [
    { id: 'P001', name: 'Patient A', type: 'X-Ray', status: 'Completed', date: '2026-04-28' },
    { id: 'P002', name: 'Patient B', type: 'CT Scan', status: 'Processing', date: '2026-04-28' },
    { id: 'P003', name: 'Patient C', type: 'X-Ray', status: 'Pending', date: '2026-04-27' }
  ]

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time overview of radiology operations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Scans</h4>
          <div className="value">{stats.totalScans}</div>
          <div className="change">+12% from last month</div>
        </div>
        <div className="stat-card">
          <h4>Pending Reports</h4>
          <div className="value">{stats.pendingReports}</div>
          <div className="change">-8% from yesterday</div>
        </div>
        <div className="stat-card">
          <h4>Active Patients</h4>
          <div className="value">{stats.activePatients}</div>
          <div className="change">+5% this week</div>
        </div>
        <div className="stat-card">
          <h4>AI Accuracy</h4>
          <div className="value">{stats.accuracy}%</div>
          <div className="change">+0.3% improvement</div>
        </div>
      </div>

      <div className="card">
        <h3>Weekly Scan Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" stroke="#4299e1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Recent Cases</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Patient ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentCases.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{c.id}</td>
                <td style={{ padding: '12px' }}>{c.name}</td>
                <td style={{ padding: '12px' }}>{c.type}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    background: c.status === 'Completed' ? '#c6f6d5' : '#fed7d7',
                    color: c.status === 'Completed' ? '#22543d' : '#742a2a'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
