import { useState } from 'react'
import { Upload, Scan, Brain, FileText, Download, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'

function RadiologyHub() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [language, setLanguage] = useState('english')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('language', language)
      
      // Simulate API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock result
      setResult({
        prediction: 'Pneumonia',
        confidence: 92.5,
        findings: [
          'Bilateral infiltrates detected in lower lobes',
          'Increased opacity in right middle lobe',
          'No pleural effusion observed',
          'Heart size within normal limits'
        ],
        recommendation: 'Immediate consultation with pulmonologist recommended. Consider antibiotic therapy.',
        severity: 'moderate'
      })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
          AI Radiology Analysis
        </h1>
        <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
          Upload medical scans for instant AI-powered diagnosis and analysis
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Upload Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} /> Upload Scan
          </h3>

          {!preview ? (
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              border: '2px dashed #E1E8ED',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: '#F8FAFB'
            }}>
              <Scan size={48} color="#7F8C8D" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: '13px', color: '#7F8C8D' }}>
                PNG, JPG, DICOM up to 10MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '20px',
                border: '1px solid #E1E8ED'
              }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                  Report Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="telugu">Telugu (తెలుగు)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: analyzing ? '#BDC3C7' : 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {analyzing ? (
                    <>
                      <Clock size={18} className="spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Analyze with AI
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                    setResult(null)
                  }}
                  style={{
                    padding: '14px 20px',
                    background: '#F5F7FA',
                    color: '#2C3E50',
                    border: '1px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} /> Analysis Results
          </h3>

          {!result && !analyzing && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#7F8C8D',
              textAlign: 'center'
            }}>
              <Eye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px', fontWeight: 500 }}>
                Upload and analyze a scan to see results
              </p>
            </div>
          )}

          {analyzing && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px'
            }}>
              <div className="loading-spinner" style={{ marginBottom: '20px' }}></div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C3E50' }}>
                AI is analyzing your scan...
              </p>
              <p style={{ fontSize: '13px', color: '#7F8C8D', marginTop: '8px' }}>
                This may take a few moments
              </p>
            </div>
          )}

          {result && (
            <div>
              {/* Prediction */}
              <div style={{
                padding: '20px',
                background: result.severity === 'high' ? '#FFF4E6' : result.severity === 'moderate' ? '#FFF9E6' : '#D5F4E6',
                borderRadius: '12px',
                marginBottom: '20px',
                border: `2px solid ${result.severity === 'high' ? '#E67E22' : result.severity === 'moderate' ? '#F39C12' : '#27AE60'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {result.severity === 'high' ? <AlertCircle size={20} color="#E67E22" /> : <CheckCircle size={20} color="#27AE60" />}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase' }}>
                    Diagnosis
                  </span>
                </div>
                <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
                  {result.prediction}
                </h4>
                <p style={{ fontSize: '14px', color: '#2C3E50', margin: 0 }}>
                  Confidence: <strong>{result.confidence}%</strong>
                </p>
              </div>

              {/* Findings */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px' }}>
                  Key Findings
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {result.findings.map((finding, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: '#2C3E50', marginBottom: '8px' }}>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div style={{
                padding: '16px',
                background: '#F8FAFB',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid #E1E8ED'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '8px' }}>
                  Recommendation
                </h4>
                <p style={{ fontSize: '14px', color: '#2C3E50', margin: 0 }}>
                  {result.recommendation}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px' }}>
          Recent Scans
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              padding: '16px',
              background: '#F8FAFB',
              borderRadius: '12px',
              border: '1px solid #E1E8ED',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <div style={{
                width: '100%',
                height: '120px',
                background: '#E1E8ED',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Scan size={32} color="#7F8C8D" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: '0 0 4px 0' }}>
                Scan #{i}
              </p>
              <p style={{ fontSize: '12px', color: '#7F8C8D', margin: 0 }}>
                2 hours ago
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RadiologyHub
