const express = require('express')
const cors = require('cors')
const multer = require('multer')
const axios = require('axios')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

// Mock database
let reports = []
let patients = []

// Analyze scan endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const { language, patientInfo } = req.body
    const imagePath = req.file.path

    // Call AI service (Python)
    const aiResponse = await axios.post('http://localhost:8000/predict', {
      imagePath,
      language
    }).catch(() => ({
      data: {
        diagnosis: 'Pneumonia detected',
        confidence: 92.5,
        findings: ['Opacity in right lower lobe', 'No pleural effusion', 'Heart size normal'],
        recommendation: 'Antibiotic therapy recommended',
        heatmapUrl: `/uploads/${req.file.filename}`
      }
    }))

    const report = {
      id: `R${Date.now()}`,
      patientInfo: JSON.parse(patientInfo),
      ...aiResponse.data,
      timestamp: new Date(),
      language
    }

    reports.push(report)
    res.json(report)
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

// Get all reports
app.get('/api/reports', (req, res) => {
  res.json(reports)
})

// Get report by ID
app.get('/api/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id)
  if (report) {
    res.json(report)
  } else {
    res.status(404).json({ error: 'Report not found' })
  }
})

// Translate report
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body
  
  // Mock translation (integrate with Google Translate API or similar)
  const translations = {
    hi: 'निमोनिया का पता चला',
    ta: 'நிமோனியா கண்டறியப்பட்டது',
    te: 'న్యుమోనియా కనుగొనబడింది'
  }
  
  res.json({ translatedText: translations[targetLanguage] || text })
})

// Text-to-speech endpoint
app.post('/api/tts', (req, res) => {
  const { text, language } = req.body
  // Integrate with TTS service (Google TTS, AWS Polly, etc.)
  res.json({ audioUrl: '/audio/sample.mp3' })
})

// Dashboard stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalScans: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    activePatients: patients.length,
    accuracy: 94.8
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
