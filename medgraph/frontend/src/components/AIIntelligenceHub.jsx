import { useState } from 'react'
import { Brain, Mic, Send, AlertCircle, CheckCircle, Activity } from 'lucide-react'
import './AIIntelligenceHub.css'

function AIIntelligenceHub({ setCurrentAnalysis, setGraphData }) {
  const [symptoms, setSymptoms] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showExplainability, setShowExplainability] = useState(false)
  const [thinkingStep, setThinkingStep] = useState('')

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setThinkingStep('Extracting symptoms...')
    
    await new Promise(r => setTimeout(r, 800))
    setThinkingStep('Querying knowledge graph...')
    
    await new Promise(r => setTimeout(r, 1000))
    setThinkingStep('Ranking predictions...')
    
    await new Promise(r => setTimeout(r, 800))
    setThinkingStep('Generating recommendations...')
    
    await new Promise(r => setTimeout(r, 600))
    
    const mockAnalysis = {
      extractedSymptoms: ['chest tightness', 'shortness of breath', 'exertional dyspnea'],
      predictions: [
        {
          disease: 'Angina Pectoris',
          icd10: 'I20.9',
          probability: 78,
          confidence: [72, 84],
          urgency: 'urgent',
          description: 'Chest pain due to reduced blood flow to heart muscle'
        },
        {
          disease: 'Acute Coronary Syndrome',
          icd10: 'I24.9',
          probability: 61,
          confidence: [54, 68],
          urgency: 'emergency',
          description: 'Sudden reduction in blood flow to the heart'
        },
        {
          disease: 'GERD',
          icd10: 'K21.9',
          probability: 34,
          confidence: [28, 40],
          urgency: 'routine',
          description: 'Gastroesophageal reflux disease'
        }
      ],
      riskFlags: [
        { type: 'urgent', message: 'Cardiac symptoms detected - recommend immediate evaluation' },
        { type: 'history', message: 'Patient history of hypertension increases cardiac risk by 18%' }
      ],
      suggestedTests: [
        { name: 'ECG', type: 'Diagnostic', yield: 'High', cost: '$50-100' },
        { name: 'Troponin Test', type: 'Lab', yield: 'High', cost: '$80-150' },
        { name: 'Chest X-Ray', type: 'Imaging', yield: 'Medium', cost: '$100-200' }
      ],
      reasoning: {
        path: [
          { from: 'Chest Tightness', to: 'Angina Pectoris', confidence: 0.82, reason: 'SYMPTOM_OF' },
          { from: 'Patient Age (52)', to: 'Angina Pectoris', confidence: 0.18, reason: 'AGE_RISK_FACTOR' },
          { from: 'Hypertension History', to: 'Angina Pectoris', confidence: 0.15, reason: 'COMORBIDITY' }
        ]
      }
    }
    
    setAnalysis(mockAnalysis)
    setCurrentAnalysis(mockAnalysis)
    setGraphData(mockAnalysis.reasoning)
    setIsAnalyzing(false)
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      emergency: 'var(--emergency-red)',
      urgent: 'var(--urgent-orange)',
      monitor: 'var(--monitor-yellow)',
      routine: 'var(--routine-green)'
    }
    return colors[urgency] || colors.routine
  }

  return (
    <div className="ai-intelligence-hub">
      <div className="panel-card hero-card">
        <h3><Brain size={22} /> AI Symptom Intelligence Hub</h3>
        
        <div className="symptom-input-section">
          <textarea
            className="symptom-input"
            placeholder="Describe your symptoms in natural language... (e.g., 'I have been having chest tightness and shortness of breath for the past two days')"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
          />
          
          <div className="input-actions">
            <button className="voice-input-btn">
              <Mic size={18} />
              Voice Input
            </button>
            <button 
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!symptoms || isAnalyzing}
            >
              <Send size={18} />
              Analyze Symptoms
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="thinking-indicator">
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>{thinkingStep}</span>
          </div>
        )}

        {analysis && (
          <>
            <div className="extracted-symptoms">
              <h4>Extracted Symptoms</h4>
              <div className="symptom-tags">
                {analysis.extractedSymptoms.map((s, i) => (
                  <span key={i} className="symptom-tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="predictions-section">
              <h4>Disease Predictions</h4>
              {analysis.predictions.map((pred, idx) => (
                <div key={idx} className="prediction-card" style={{ borderLeft: `4px solid ${getUrgencyColor(pred.urgency)}` }}>
                  <div className="prediction-header">
                    <div>
                      <h5>{pred.disease}</h5>
                      <span className="icd-code">{pred.icd10}</span>
                    </div>
                    <div className="prediction-score">
                      <div className="probability">{pred.probability}%</div>
                      <span className={`badge badge-${pred.urgency}`}>{pred.urgency.toUpperCase()}</span>
                    </div>
                  </div>
                  <p className="prediction-desc">{pred.description}</p>
                  <div className="confidence-range">
                    Confidence: {pred.confidence[0]}-{pred.confidence[1]}%
                  </div>
                </div>
              ))}
            </div>

            <div className="risk-flags-section">
              <h4><AlertCircle size={18} /> Risk Flags</h4>
              {analysis.riskFlags.map((flag, idx) => (
                <div key={idx} className={`risk-flag risk-${flag.type}`}>
                  <AlertCircle size={16} />
                  <span>{flag.message}</span>
                </div>
              ))}
            </div>

            <div className="suggested-tests-section">
              <h4><Activity size={18} /> Suggested Tests</h4>
              <div className="tests-grid">
                {analysis.suggestedTests.map((test, idx) => (
                  <div key={idx} className="test-card">
                    <div className="test-name">{test.name}</div>
                    <div className="test-meta">
                      <span>{test.type}</span>
                      <span>Yield: {test.yield}</span>
                    </div>
                    <div className="test-cost">{test.cost}</div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="explainability-toggle"
              onClick={() => setShowExplainability(!showExplainability)}
            >
              {showExplainability ? 'Hide' : 'Show'} Reasoning Path
            </button>

            {showExplainability && (
              <div className="explainability-panel">
                <h4>Why this diagnosis?</h4>
                <div className="reasoning-path">
                  {analysis.reasoning.path.map((step, idx) => (
                    <div key={idx} className="reasoning-step">
                      <div className="step-nodes">
                        <span className="node-from">{step.from}</span>
                        <span className="edge-label">{step.reason}</span>
                        <span className="node-to">{step.to}</span>
                      </div>
                      <div className="step-confidence">
                        Confidence: +{(step.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AIIntelligenceHub
