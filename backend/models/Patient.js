const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  contactNumber: String,
  email: String,
  address: String,
  medicalHistory: [String],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  preferredLanguage: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Patient', patientSchema)
