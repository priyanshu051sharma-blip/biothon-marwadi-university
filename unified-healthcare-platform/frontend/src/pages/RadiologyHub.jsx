import { useMemo, useState } from 'react'
import {
  Upload,
  Scan,
  Brain,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import axios from 'axios'
import api from '../services/api'

function toPercent(value) {
  const num = Number(value || 0)
  if (Number.isNaN(num)) return 0
  return num <= 1 ? Number((num * 100).toFixed(1)) : Number(num.toFixed(1))
}

function severityFromPrediction(prediction) {
  const lower = String(prediction || '').toLowerCase()
  if (lower.includes('cancer') || lower.includes('tuberculosis')) return 'high'
  if (lower.includes('pneumonia') || lower.includes('bronchitis')) return 'moderate'
  return 'low'
}

function RadiologyHub() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [scanType, setScanType] = useState('xray')
  const [analyzing, setAnalyzing] = useState(false)
  const [summary, setSummary] = useState(null)
  const [matrixResult, setMatrixResult] = useState(null)
  const [error, setError] = useState('')
  const risApiUrl = (import.meta.env.VITE_RIS_API_URL || 'http://127.0.0.1:8010').replace(/\/$/, '')

  const modelEntries = useMemo(() => Object.entries(matrixResult?.models || {}), [matrixResult])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setSummary(null)
    setMatrixResult(null)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const buildSummaryFromMatrix = (data) => {
    const entries = Object.entries(data?.models || {})
    if (!entries.length) return null

    const [bestModelKey, bestModel] = entries.reduce((best, current) => {
      const bestConfidence = Number(best[1]?.confidence || 0)
      const currentConfidence = Number(current[1]?.confidence || 0)
      return currentConfidence > bestConfidence ? current : best
    })

    const findings = entries.map(([key, model]) => {
      const label = model.label || key
      const prediction = model.prediction || 'N/A'
      const confidence = toPercent(model.confidence)
      return `${label}: ${prediction} (${confidence}%)`
    })

    return {
      prediction: bestModel?.prediction || 'Analysis complete',
      confidence: toPercent(bestModel?.confidence),
      severity: severityFromPrediction(bestModel?.prediction),
      reportId: data?.report_id || null,
      findings,
      recommendation: 'Review ensemble model outputs and composite heatmaps before final clinical decision.',
      keyModel: bestModel?.label || bestModelKey,
      heatmap: bestModel?.overlay || bestModel?.heatmap || null,
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setAnalyzing(true)
    setError('')

    try {
      const makeFormData = () => {
        const fd = new FormData()
        fd.append('image', selectedFile)
        fd.append('scanType', scanType)
        return fd
      }

      let response = null
      const requests = [
        () =>
          api.post('/api/radiology/ensemble-analyze', makeFormData(), {
            headers: { 'Content-Type': 'multipart/form-data' },
          }),
        () =>
          api.post('/api/analyze', makeFormData(), {
            headers: { 'Content-Type': 'multipart/form-data' },
          }),
        () => {
          return axios.post(`${risApiUrl}/api/analyze`, makeFormData(), {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        },
      ]

      for (const request of requests) {
        try {
          response = await request()
          break
        } catch (routeError) {
          const status = routeError?.response?.status
          if (![404, 405, 502, 503].includes(status)) {
            throw routeError
          }
        }
      }

      if (!response) {
        throw new Error('No reachable radiology inference endpoint found')
      }

      const data = response.data || {}
      setMatrixResult(data)

      if (data.models && Object.keys(data.models).length > 0) {
        setSummary(buildSummaryFromMatrix(data))
      } else {
        setSummary({
          prediction: data.diagnosis || data.prediction || 'Analysis complete',
          confidence: toPercent(data.confidence),
          severity: severityFromPrediction(data.diagnosis || data.prediction),
          reportId: data.report_id || null,
          findings: data.findings || ['No model matrix returned by backend.'],
          recommendation: data.recommendation || 'Review backend inference logs and retry.',
          keyModel: 'Single model response',
          heatmap: data.heatmap_url || data.heatmap || null,
        })
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(
        err?.response?.data?.detail ||
          'Unable to run RIS ensemble analysis. Start HealthAI backend on :8000 and RIS backend on :8010, or set VITE_RIS_API_URL.'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setSummary(null)
    setMatrixResult(null)
    setError('')
  }

  const handleDownload = () => {
    if (!summary) return
    const payload = {
      generated_at: new Date().toISOString(),
      scan_type: scanType,
      file_name: selectedFile?.name || 'scan',
      summary,
      matrix: matrixResult,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `radiology-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
          AI Radiology Analysis
        </h1>
        <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
          Ensemble inference for CT and X-ray with source, heatmap, and composite visualizations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} /> Upload Scan
          </h3>

          {!preview ? (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                border: '2px dashed #E1E8ED',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: '#F8FAFB',
              }}
            >
              <Scan size={48} color="#7F8C8D" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: '13px', color: '#7F8C8D' }}>PNG, JPG, JPEG</p>
              <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
            </label>
          ) : (
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '1px solid #E1E8ED',
                }}
              >
                <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>
                  Scan Type
                </label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                  }}
                >
                  <option value="xray">Radiography (X-Ray)</option>
                  <option value="ct">Computed Tomography (CT)</option>
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
                    gap: '8px',
                  }}
                >
                  {analyzing ? (
                    <>
                      <Clock size={18} className="spin" />
                      Running Ensemble...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Run Diagnostics
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    padding: '14px 20px',
                    background: '#F5F7FA',
                    color: '#2C3E50',
                    border: '1px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} /> Analysis Results
          </h3>

          {!summary && !analyzing && !error && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                color: '#7F8C8D',
                textAlign: 'center',
              }}
            >
              <Eye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px', fontWeight: 500 }}>Upload and analyze a scan to see results</p>
            </div>
          )}

          {analyzing && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
              }}
            >
              <div className="loading-spinner" style={{ marginBottom: '20px' }}></div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C3E50' }}>AI is processing model ensemble...</p>
              <p style={{ fontSize: '13px', color: '#7F8C8D', marginTop: '8px' }}>This can take longer for CT scans</p>
            </div>
          )}

          {error && !analyzing && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#FFF4F4',
                border: '1px solid #F5B7B1',
                color: '#922B21',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {summary && (
            <div>
              <div
                style={{
                  padding: '20px',
                  background:
                    summary.severity === 'high' ? '#FFF4E6' : summary.severity === 'moderate' ? '#FFF9E6' : '#D5F4E6',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  border: `2px solid ${summary.severity === 'high' ? '#E67E22' : summary.severity === 'moderate' ? '#F39C12' : '#27AE60'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {summary.severity === 'high' ? <AlertCircle size={20} color="#E67E22" /> : <CheckCircle size={20} color="#27AE60" />}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase' }}>Top Prediction</span>
                </div>
                <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>{summary.prediction}</h4>
                <p style={{ fontSize: '14px', color: '#2C3E50', margin: 0 }}>
                  Confidence: <strong>{summary.confidence}%</strong>
                </p>
                <p style={{ fontSize: '13px', color: '#7F8C8D', margin: '6px 0 0 0' }}>
                  Primary model: <strong>{summary.keyModel}</strong>
                </p>
                {summary.reportId && (
                  <p style={{ fontSize: '13px', color: '#7F8C8D', margin: '6px 0 0 0' }}>
                    Report ID: <strong>{summary.reportId}</strong>
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px' }}>Model Findings</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {summary.findings.map((finding, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: '#2C3E50', marginBottom: '8px' }}>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFB', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E1E8ED' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '8px' }}>Recommendation</h4>
                <p style={{ fontSize: '14px', color: '#2C3E50', margin: 0 }}>{summary.recommendation}</p>
              </div>

              {summary.heatmap && (
                <div style={{ padding: '16px', background: '#F8FAFB', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E1E8ED' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px' }}>Top Model Composite</h4>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E1E8ED', background: 'white' }}>
                    <img src={summary.heatmap} alt="Top model composite" style={{ width: '100%', display: 'block' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleDownload}
                  style={{
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
                    gap: '8px',
                  }}
                >
                  <Download size={16} />
                  Download Report JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modelEntries.length > 0 && (
        <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', margin: 0 }}>XAI Matrix</h3>
            <button
              onClick={() => {
                setSummary(null)
                setMatrixResult(null)
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #E1E8ED',
                background: '#F5F7FA',
                color: '#2C3E50',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={14} /> Clear Cache
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {modelEntries.map(([modelKey, data]) => (
              <div
                key={modelKey}
                style={{
                  border: '1px solid #E1E8ED',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#FBFCFD',
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0A2540' }}>{data.label || modelKey}</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#2C3E50' }}>
                    Prediction: <strong>{data.prediction || 'N/A'}</strong> | Confidence: <strong>{toPercent(data.confidence)}%</strong>
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                  {[
                    { title: 'Source', image: matrixResult?.original },
                    { title: 'Heatmap', image: data.heatmap },
                    { title: 'Composite', image: data.overlay },
                  ].map((panel) => (
                    <div key={panel.title}>
                      <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {panel.title}
                      </p>
                      <div style={{ border: '1px solid #E1E8ED', borderRadius: '10px', overflow: 'hidden', background: '#0A2540' }}>
                        {panel.image ? (
                          <img src={panel.image} alt={`${panel.title} ${data.label || modelKey}`} style={{ width: '100%', display: 'block', aspectRatio: '1 / 1', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ aspectRatio: '1 / 1', display: 'grid', placeItems: 'center', color: '#D5DBDB', fontSize: '12px' }}>
                            Not available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RadiologyHub
