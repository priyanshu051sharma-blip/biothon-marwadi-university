import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react'
import './ProactiveInsights.css'

function ProactiveInsights() {
  const insights = [
    {
      type: 'prediction',
      icon: <TrendingUp size={18} />,
      title: 'Pattern Detection',
      message: 'Your symptom history over the past 6 months shows patterns consistent with early-stage cardiovascular stress. Recommend comprehensive cardiac evaluation.',
      priority: 'high'
    },
    {
      type: 'escalation',
      icon: <AlertTriangle size={18} />,
      title: 'Risk Escalation',
      message: 'Blood pressure readings have increased 15% over 3 weeks. Cardiologist consultation recommended within 48 hours.',
      priority: 'urgent'
    },
    {
      type: 'preventive',
      icon: <Lightbulb size={18} />,
      title: 'Preventive Care',
      message: 'Annual lipid panel overdue based on age (52) and family history of cardiac disease. Schedule within 30 days.',
      priority: 'routine'
    }
  ]

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'var(--emergency-red)',
      high: 'var(--urgent-orange)',
      routine: 'var(--routine-green)'
    }
    return colors[priority] || colors.routine
  }

  return (
    <div className="proactive-insights">
      <div className="panel-card insights-card">
        <h3><Lightbulb size={20} /> Proactive Health Insights</h3>
        <p className="insights-subtitle">AI-powered predictive health monitoring</p>
        
        <div className="insights-list">
          {insights.map((insight, idx) => (
            <div 
              key={idx} 
              className="insight-item"
              style={{ borderLeft: `4px solid ${getPriorityColor(insight.priority)}` }}
            >
              <div className="insight-header">
                <div className="insight-icon" style={{ color: getPriorityColor(insight.priority) }}>
                  {insight.icon}
                </div>
                <div className="insight-title-section">
                  <h4>{insight.title}</h4>
                  <span className={`priority-badge priority-${insight.priority}`}>
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="insight-message">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProactiveInsights
