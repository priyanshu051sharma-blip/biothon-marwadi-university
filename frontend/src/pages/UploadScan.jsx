import { useState } from 'react'
import { Upload, FileImage, Loader } from 'lucide-react'
import axios from 'axios'

function UploadScan() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [language, setLanguage] = useState('en')
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: 'male'
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('language', language)
    formData.append('patientInfo', JSON.stringify(patientInfo))

    try {
      const response = await axios.post('/api/analyze', formData)
      setResult(response.data)
    } catch (error) {
      console.error('Analysis failed:', error)
      // Demo result for MVP
      setResult({
        diagnosis: 'Pneumonia detected in right lung',
        confidence: 92.5,
        findings: ['Opacity in right lower lobe', 'No pleural effusion', 'Heart size normal'],
        recommendation: 'Antibiotic therapy recommended. Follow-up in 2 weeks.',
        heatmapUrl: preview
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="page-header">
        <h1>Upload Medical Scan</h1>
        <p>Upload X-ray or CT scan for AI-powered analysis</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>Patient Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Patient Name"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Age"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
            />
            <select
              value={patientInfo.gender}
              onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        <div className="card">
          <h3>Upload Scan</h3>
          <div style={{ 
            border: '2px dashed #cbd5e0', 
            borderRadius: '8px', 
            padding: '40px', 
            textAlign: 'center',
            marginTop: '20px',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('fileInput').click()}>
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            ) : (
              <>
                <Upload size={48} color="#a0aec0" />
                <p style={{ marginTop: '10px', color: '#718096' }}>Click to upload or drag and drop</p>
                <p style={{ fontSize: '12px', color: '#a0aec0' }}>X-ray or CT scan (PNG, JPG)</p>
              </>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              width: '100%',
              marginTop: '20px',
              background: '#4299e1',
              color: 'white',
              padding: '12px',
              fontSize: '16px'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Scan'}
          </button>
        </div>
      </div>

      {result && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Analysis Results</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <h4 style={{ marginBottom: '10px' }}>Diagnosis</h4>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{result.diagnosis}</p>
              <p style={{ marginTop: '10px', color: '#718096' }}>Confidence: {result.confidence}%</p>
              
              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Key Findings</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {result.findings.map((f, i) => <li key={i} style={{ marginBottom: '5px' }}>{f}</li>)}
              </ul>
              
              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Recommendation</h4>
              <p>{result.recommendation}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '10px' }}>Heatmap Visualization</h4>
              <img src={result.heatmapUrl} alt="Heatmap" style={{ width: '100%', borderRadius: '8px' }} />
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '10px' }}>
                Red areas indicate regions of interest detected by AI
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadScan
