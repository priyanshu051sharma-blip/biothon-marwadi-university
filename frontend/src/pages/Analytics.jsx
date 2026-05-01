import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function Analytics() {
  const diagnosisData = [
    { name: 'Normal', value: 450 },
    { name: 'Pneumonia', value: 120 },
    { name: 'Tuberculosis', value: 45 },
    { name: 'COVID-19', value: 32 },
    { name: 'Other', value: 78 }
  ]

  const monthlyData = [
    { month: 'Jan', scans: 890 },
    { month: 'Feb', scans: 920 },
    { month: 'Mar', scans: 1050 },
    { month: 'Apr', scans: 1247 }
  ]

  const COLORS = ['#48bb78', '#4299e1', '#ed8936', '#f56565', '#9f7aea']

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics & Insights</h1>
        <p>Performance metrics and diagnostic trends</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Average Processing Time</h4>
          <div className="value">2.3s</div>
          <div className="change">-15% faster</div>
        </div>
        <div className="stat-card">
          <h4>Reports Generated</h4>
          <div className="value">1,247</div>
          <div className="change">+18% this month</div>
        </div>
        <div className="stat-card">
          <h4>AI Accuracy Rate</h4>
          <div className="value">94.8%</div>
          <div className="change">+0.3% improvement</div>
        </div>
        <div className="stat-card">
          <h4>Patient Satisfaction</h4>
          <div className="value">4.7/5</div>
          <div className="change">+0.2 rating</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>Monthly Scan Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#4299e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Diagnosis Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diagnosisData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>System Performance Metrics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Metric</th>
              <th style={{ padding: '12px' }}>Current</th>
              <th style={{ padding: '12px' }}>Target</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>AI Model Accuracy</td>
              <td style={{ padding: '12px' }}>94.8%</td>
              <td style={{ padding: '12px' }}>95%</td>
              <td style={{ padding: '12px', color: '#48bb78' }}>On Track</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>Average Report Time</td>
              <td style={{ padding: '12px' }}>2.3s</td>
              <td style={{ padding: '12px' }}>3s</td>
              <td style={{ padding: '12px', color: '#48bb78' }}>Exceeding</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>System Uptime</td>
              <td style={{ padding: '12px' }}>99.7%</td>
              <td style={{ padding: '12px' }}>99.5%</td>
              <td style={{ padding: '12px', color: '#48bb78' }}>Exceeding</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analytics
