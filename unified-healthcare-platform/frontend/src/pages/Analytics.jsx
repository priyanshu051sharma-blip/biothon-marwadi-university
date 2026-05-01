import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Users, Activity, Scan, Brain, Calendar, Download } from 'lucide-react'

function Analytics() {
  const monthlyPatients = [
    { month: 'Jan', patients: 245, scans: 180, aiAnalyses: 156 },
    { month: 'Feb', patients: 268, scans: 195, aiAnalyses: 172 },
    { month: 'Mar', patients: 290, scans: 215, aiAnalyses: 198 },
    { month: 'Apr', patients: 312, scans: 238, aiAnalyses: 215 },
    { month: 'May', patients: 335, scans: 265, aiAnalyses: 242 },
    { month: 'Jun', patients: 358, scans: 285, aiAnalyses: 268 }
  ]

  const diseaseDistribution = [
    { name: 'Respiratory', value: 320, color: '#3498DB' },
    { name: 'Cardiovascular', value: 245, color: '#E74C3C' },
    { name: 'Diabetes', value: 198, color: '#9B59B6' },
    { name: 'Neurological', value: 156, color: '#F39C12' },
    { name: 'Orthopedic', value: 142, color: '#27AE60' },
    { name: 'Other', value: 186, color: '#7F8C8D' }
  ]

  const departmentPerformance = [
    { dept: 'Radiology', satisfaction: 94, efficiency: 92, volume: 285 },
    { dept: 'Cardiology', satisfaction: 91, efficiency: 88, volume: 245 },
    { dept: 'Neurology', satisfaction: 89, efficiency: 85, volume: 198 },
    { dept: 'Orthopedics', satisfaction: 93, efficiency: 90, volume: 220 },
    { dept: 'General', satisfaction: 87, efficiency: 86, volume: 312 }
  ]

  const aiAccuracyTrend = [
    { week: 'W1', accuracy: 89.2, predictions: 145 },
    { week: 'W2', accuracy: 90.5, predictions: 168 },
    { week: 'W3', accuracy: 91.8, predictions: 182 },
    { week: 'W4', accuracy: 92.4, predictions: 195 },
    { week: 'W5', accuracy: 93.1, predictions: 208 },
    { week: 'W6', accuracy: 94.8, predictions: 225 }
  ]

  const stats = [
    { label: 'Total Patients', value: '2,847', change: '+18.2%', trend: 'up', icon: Users, color: '#3498DB' },
    { label: 'AI Analyses', value: '1,456', change: '+24.5%', trend: 'up', icon: Brain, color: '#9B59B6' },
    { label: 'Scans Completed', value: '1,378', change: '+15.8%', trend: 'up', icon: Scan, color: '#27AE60' },
    { label: 'Avg Wait Time', value: '12 min', change: '-8.3%', trend: 'down', icon: Activity, color: '#E67E22' }
  ]

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
            Analytics Dashboard
          </h1>
          <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
            Comprehensive insights and performance metrics
          </p>
        </div>
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E1E8ED',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: stat.color
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${stat.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <Icon size={24} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: stat.trend === 'up' ? '#D5F4E6' : '#FFF4E6',
                  borderRadius: '6px'
                }}>
                  {stat.trend === 'up' ? <TrendingUp size={14} color="#27AE60" /> : <TrendingDown size={14} color="#E67E22" />}
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: stat.trend === 'up' ? '#27AE60' : '#E67E22'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#7F8C8D', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                {stat.value}
              </h3>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
            Monthly Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyPatients}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498DB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3498DB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27AE60" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#27AE60" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8ED" />
              <XAxis dataKey="month" stroke="#7F8C8D" />
              <YAxis stroke="#7F8C8D" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="patients" stroke="#3498DB" fillOpacity={1} fill="url(#colorPatients)" strokeWidth={2} />
              <Area type="monotone" dataKey="scans" stroke="#27AE60" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
            Disease Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
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

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
            Department Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8ED" />
              <XAxis dataKey="dept" stroke="#7F8C8D" />
              <YAxis stroke="#7F8C8D" />
              <Tooltip />
              <Legend />
              <Bar dataKey="satisfaction" fill="#3498DB" radius={[8, 8, 0, 0]} />
              <Bar dataKey="efficiency" fill="#27AE60" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
            AI Model Accuracy Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiAccuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8ED" />
              <XAxis dataKey="week" stroke="#7F8C8D" />
              <YAxis stroke="#7F8C8D" domain={[85, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#9B59B6" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
          Key Performance Indicators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { label: 'Patient Satisfaction', value: 92, target: 90, color: '#27AE60' },
            { label: 'AI Diagnostic Accuracy', value: 94.8, target: 95, color: '#9B59B6' },
            { label: 'Average Response Time', value: 2.3, target: 3, color: '#3498DB', unit: 's' },
            { label: 'Bed Occupancy Rate', value: 78, target: 85, color: '#E67E22' },
            { label: 'Staff Efficiency', value: 88, target: 85, color: '#27AE60' },
            { label: 'Equipment Utilization', value: 82, target: 80, color: '#3498DB' }
          ].map((kpi, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: '#F8FAFB',
              borderRadius: '12px',
              border: '1px solid #E1E8ED'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>
                  {kpi.label}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#0A2540' }}>
                  {kpi.value}{kpi.unit || '%'}
                </span>
              </div>
              <div style={{ height: '8px', background: '#E1E8ED', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{
                  width: `${kpi.unit ? (kpi.value / kpi.target) * 100 : kpi.value}%`,
                  height: '100%',
                  background: kpi.value >= kpi.target ? kpi.color : '#E67E22',
                  borderRadius: '4px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
              <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                Target: {kpi.target}{kpi.unit || '%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
