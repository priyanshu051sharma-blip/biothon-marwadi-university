import { useState, useEffect } from 'react'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Brain,
  Scan,
  Calendar,
  Clock
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 1247,
    activeScans: 23,
    aiAnalyses: 156,
    pendingReports: 12,
    avgResponseTime: '2.3s',
    aiAccuracy: 94.8
  })

  const [recentActivity] = useState([
    { id: 1, type: 'scan', patient: 'John Anderson', action: 'CT Scan completed', time: '5 min ago', status: 'completed' },
    { id: 2, type: 'analysis', patient: 'Sarah Miller', action: 'AI symptom analysis', time: '12 min ago', status: 'processing' },
    { id: 3, type: 'report', patient: 'Michael Chen', action: 'Radiology report generated', time: '25 min ago', status: 'completed' },
    { id: 4, type: 'appointment', patient: 'Emma Wilson', action: 'Cardiology appointment booked', time: '1 hour ago', status: 'scheduled' }
  ])

  const weeklyData = [
    { day: 'Mon', scans: 45, analyses: 62, reports: 38 },
    { day: 'Tue', scans: 52, analyses: 71, reports: 45 },
    { day: 'Wed', scans: 48, analyses: 65, reports: 42 },
    { day: 'Thu', scans: 61, analyses: 78, reports: 55 },
    { day: 'Fri', scans: 55, analyses: 69, reports: 48 },
    { day: 'Sat', scans: 38, analyses: 45, reports: 32 },
    { day: 'Sun', scans: 42, analyses: 51, reports: 36 }
  ]

  const diseaseDistribution = [
    { name: 'Normal', value: 450, color: '#27AE60' },
    { name: 'Pneumonia', value: 120, color: '#E67E22' },
    { name: 'Cardiac', value: 85, color: '#E74C3C' },
    { name: 'Tuberculosis', value: 45, color: '#9B59B6' },
    { name: 'Other', value: 78, color: '#3498DB' }
  ]

  const aiPerformance = [
    { metric: 'Accuracy', value: 94.8, target: 95 },
    { metric: 'Speed', value: 98.2, target: 95 },
    { metric: 'Reliability', value: 99.1, target: 99 }
  ]

  const handleGenerateReport = () => {
    const reportContent = `Healthcare MVP - System Overview Report
Generated on: ${new Date().toLocaleString()}

Overall Statistics:
-------------------
Total Patients: ${stats.totalPatients}
Active Scans: ${stats.activeScans}
AI Analyses: ${stats.aiAnalyses}
Pending Reports: ${stats.pendingReports}

AI Performance Metrics:
-----------------------
Average Response Time: ${stats.avgResponseTime}
Overall AI Accuracy: ${stats.aiAccuracy}%
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Healthcare_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Real-time healthcare intelligence overview</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Clock size={18} />
            Last 7 days
          </button>
          <button className="btn-primary" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Patients</p>
            <h3 className="stat-value">{stats.totalPatients}</h3>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <Scan size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Scans</p>
            <h3 className="stat-value">{stats.activeScans}</h3>
            <span className="stat-change positive">+8% this week</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Brain size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">AI Analyses</p>
            <h3 className="stat-value">{stats.aiAnalyses}</h3>
            <span className="stat-change positive">+15% today</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Reports</p>
            <h3 className="stat-value">{stats.pendingReports}</h3>
            <span className="stat-change negative">-5% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Weekly Activity Trends</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot blue"></span> Scans</span>
              <span className="legend-item"><span className="dot green"></span> Analyses</span>
              <span className="legend-item"><span className="dot orange"></span> Reports</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8ED" />
              <XAxis dataKey="day" stroke="#7F8C8D" />
              <YAxis stroke="#7F8C8D" />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#3498DB" strokeWidth={2} />
              <Line type="monotone" dataKey="analyses" stroke="#27AE60" strokeWidth={2} />
              <Line type="monotone" dataKey="reports" stroke="#E67E22" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Disease Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {diseaseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <div className="activity-card">
          <div className="card-header">
            <h3><Activity size={20} /> Recent Activity</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'scan' && <Scan size={16} />}
                  {activity.type === 'analysis' && <Brain size={16} />}
                  {activity.type === 'report' && <Activity size={16} />}
                  {activity.type === 'appointment' && <Calendar size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-patient">{activity.patient}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <div className="activity-meta">
                  <span className={`status-badge ${activity.status}`}>{activity.status}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="performance-card">
          <div className="card-header">
            <h3><TrendingUp size={20} /> AI Performance Metrics</h3>
          </div>
          <div className="performance-metrics">
            {aiPerformance.map((metric, idx) => (
              <div key={idx} className="metric-item">
                <div className="metric-header">
                  <span className="metric-name">{metric.metric}</span>
                  <span className="metric-value">{metric.value}%</span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ 
                      width: `${metric.value}%`,
                      background: metric.value >= metric.target ? '#27AE60' : '#E67E22'
                    }}
                  />
                </div>
                <span className="metric-target">Target: {metric.target}%</span>
              </div>
            ))}
          </div>

          <div className="quick-stats">
            <div className="quick-stat">
              <p className="quick-stat-label">Avg Response Time</p>
              <p className="quick-stat-value">{stats.avgResponseTime}</p>
            </div>
            <div className="quick-stat">
              <p className="quick-stat-label">AI Accuracy</p>
              <p className="quick-stat-value">{stats.aiAccuracy}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
