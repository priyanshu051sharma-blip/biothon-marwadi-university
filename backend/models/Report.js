const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  patientName: String,
  age: Number,
  gender: String,
  scanType: { type: String, enum: ['X-Ray', 'CT Scan', 'MRI'], required: true },
  imagePath: String,
  diagnosis: String,
  confidence: Number,
  findings: [String],
  impression: String,
  recommendation: String,
  aiPredictions: Object,
  heatmapUrl: String,
  language: { type: String, default: 'en' },
  status: { type: String, enum: ['pending', 'completed', 'reviewed'], default: 'pending' },
  radiologist: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Report', reportSchema)
