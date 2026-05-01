import { useState } from 'react'
import { User, Heart, Pill, AlertTriangle, Calendar } from 'lucide-react'
import './PatientDigitalTwin.css'

function PatientDigitalTwin() {
  const [patient] = useState({
    id: 'P-2024-001',
    name: 'John Anderson',
    age: 52,
    gender: 'Male',
    bloodType: 'A+',
    bmi: 28.4,
    riskScore: 6.8,
    conditions: [
      { name: 'Hypertension', severity: 'Moderate', onset: '2019-03' },
      { name: 'Type 2 Diabetes', severity: 'Controlled', onset: '2021-06' }
    ],
    allergies: [
      { name: 'Penicillin', severity: 'Severe' },
      { name: 'Peanuts', severity: 'Moderate' }
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: '2x daily' },
      { name: 'Lisinopril', dosage: '10mg', frequency: '1x daily' }
    ],
    timeline: [
      { date: '2024-04-20', type: 'symptom', content: 'Chest tightness reported', severity: 'moderate' },
      { date: '2024-03-15', type: 'lab', content: 'HbA1c: 6.8% (improved)', severity: 'routine' },
      { date: '2024-02-10', type: 'diagnosis', content: 'Hypertension follow-up', severity: 'routine' },
      { date: '2023-12-05', type: 'medication', content: 'Metformin dosage adjusted', severity: 'routine' }
    ]
  })

  return (
    <div className="digital-twin">
      <div className="panel-card">
        <h3><User size={20} /> Patient Digital Twin</h3>
        
        <div className="patient-header">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
            alt={patient.name}
            className="patient-avatar"
          />
          <div className="patient-info">
            <h4>{patient.name}</h4>
            <p className="patient-id">{patient.id}</p>
            <div className="patient-stats">
              <span>{patient.age}y</span>
              <span>{patient.gender}</span>
              <span>{patient.bloodType}</span>
              <span>BMI: {patient.bmi}</span>
            </div>
          </div>
        </div>

        <div className="risk-indicator">
          <div className="risk-bar">
            <div 
              className="risk-fill" 
              style={{ width: `${(patient.riskScore / 10) * 100}%` }}
            />
          </div>
          <span className="risk-label">Risk Score: {patient.riskScore}/10</span>
        </div>
      </div>

      <div className="panel-card">
        <h3><Heart size={18} /> Active Conditions</h3>
        {patient.conditions.map((condition, idx) => (
          <div key={idx} className="condition-item">
            <div className="condition-header">
              <span className="condition-name">{condition.name}</span>
              <span className={`badge badge-${condition.severity.toLowerCase()}`}>
                {condition.severity}
              </span>
            </div>
            <p className="condition-date">Since {condition.onset}</p>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <h3><AlertTriangle size={18} /> Allergies</h3>
        {patient.allergies.map((allergy, idx) => (
          <div key={idx} className="allergy-item">
            <span className="allergy-name">{allergy.name}</span>
            <span className={`badge badge-${allergy.severity === 'Severe' ? 'emergency' : 'urgent'}`}>
              {allergy.severity}
            </span>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <h3><Pill size={18} /> Current Medications</h3>
        {patient.medications.map((med, idx) => (
          <div key={idx} className="medication-item">
            <div className="med-name">{med.name}</div>
            <div className="med-details">
              {med.dosage} • {med.frequency}
            </div>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <h3><Calendar size={18} /> Health Timeline</h3>
        <div className="timeline">
          {patient.timeline.map((event, idx) => (
            <div key={idx} className="timeline-item">
              <div className={`timeline-dot ${event.severity}`} />
              <div className="timeline-content">
                <div className="timeline-date">{event.date}</div>
                <div className="timeline-text">{event.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientDigitalTwin
