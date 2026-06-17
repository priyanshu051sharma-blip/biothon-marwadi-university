import { FileText, Download, ShieldAlert, Heart, Calendar } from 'lucide-react'
import './PatientPortal.css'

function PatientMedicalRecords() {
  const records = [
    {
      id: 'REC-9012',
      date: '2024-01-12',
      title: 'AI Symptom Diagnostic: Asthma Flare-up',
      doctor: 'Dr. Sarah Johnson (Pulmonology)',
      symptoms: 'Mild chest tightness, audible wheezing',
      prediction: 'Mild Asthma Attack (88% confidence)',
      prescription: 'Ventolin Inhaler (1 puff as needed), Montelukast 10mg (1 daily)',
      reports: ['Symptom_Triage_Report_P002.pdf']
    },
    {
      id: 'REC-8511',
      date: '2023-11-20',
      title: 'Radiology Chest Scan Analysis',
      doctor: 'AI Ensemble Diagnostic Hub',
      symptoms: 'Mild dry cough for 3 days',
      prediction: 'Normal Lung Fields (95.1% confidence)',
      prescription: 'Rest, hydration, over-the-counter cough suppressant',
      reports: ['Chest_XRay_PACS_Composite.png', 'AI_Radiology_GradCAM_Summary.pdf']
    },
    {
      id: 'REC-7410',
      date: '2023-09-05',
      title: 'Routine General Checkup',
      doctor: 'Dr. John Watson (General Medicine)',
      symptoms: 'Regular annual diagnostics',
      prediction: 'Normal clinical evaluation. BP stable.',
      prescription: 'No therapeutics required. Follow balanced diet.',
      reports: ['Lab_Hematology_Blood_Panel.pdf']
    }
  ]

  const handleDownload = (filename) => {
    alert(`Downloading ${filename} ... (Mock download executed successfully)`)
  }

  return (
    <div className="patient-medical-records">
      <div className="status-header">
        <FileText size={32} color="#2ECC71" />
        <div>
          <h2>Patient Digital Health Twin</h2>
          <p>Access your past visits, prescriptions, AI diagnostics reports, and radiological Grad-CAM scans.</p>
        </div>
      </div>

      <div className="records-list-pt">
        {records.map((rec) => (
          <div key={rec.id} className="record-card-pt">
            <div className="record-card-header-pt">
              <div className="rec-header-title">
                <h5>{rec.title}</h5>
                <span className="rec-doc">{rec.doctor}</span>
              </div>
              <div className="rec-meta">
                <span className="rec-id">{rec.id}</span>
                <span className="rec-date">
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {rec.date}
                </span>
              </div>
            </div>

            <div className="record-body-pt">
              <div className="rec-body-row">
                <span>Symptoms Reported:</span>
                <p>{rec.symptoms}</p>
              </div>
              <div className="rec-body-row">
                <span>AI Clinical Inference:</span>
                <p><strong>{rec.prediction}</strong></p>
              </div>
              <div className="rec-body-row">
                <span>Therapeutics & Prescription:</span>
                <p className="prescription-text">{rec.prescription}</p>
              </div>
            </div>

            <div className="record-footer-pt">
              <span className="footer-label">Available Diagnostic Files:</span>
              <div className="files-list-pt">
                {rec.reports.map((file, fIdx) => (
                  <button key={fIdx} className="file-download-btn" onClick={() => handleDownload(file)}>
                    <Download size={14} />
                    <span>{file}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientMedicalRecords
