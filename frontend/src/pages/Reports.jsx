import { useState } from 'react'
import { FileText, Download, Volume2 } from 'lucide-react'

function Reports() {
  const [reports] = useState([
    {
      id: 'R001',
      patientId: 'P001',
      patientName: 'Patient A',
      date: '2026-04-28',
      type: 'X-Ray',
      diagnosis: 'Normal chest X-ray',
      status: 'Completed'
    },
    {
      id: 'R002',
      patientId: 'P002',
      patientName: 'Patient B',
      date: '2026-04-28',
      type: 'CT Scan',
      diagnosis: 'Pneumonia detected',
      status: 'Completed'
    },
    {
      id: 'R003',
      patientId: 'P003',
      patientName: 'Patient C',
      date: '2026-04-27',
      type: 'X-Ray',
      diagnosis: 'Pending analysis',
      status: 'Pending'
    }
  ])

  const [selectedReport, setSelectedReport] = useState(null)

  const handleViewReport = (report) => {
    setSelectedReport({
      ...report,
      fullReport: {
        findings: 'Opacity noted in right lower lobe consistent with pneumonia. No pleural effusion. Heart size within normal limits.',
        impression: 'Right lower lobe pneumonia',
        recommendation: 'Antibiotic therapy recommended. Follow-up chest X-ray in 2 weeks to assess resolution.',
        radiologist: 'Dr. Smith',
        aiConfidence: 92.5
      }
    })
  }

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window && selectedReport) {
      const utterance = new SpeechSynthesisUtterance(selectedReport.fullReport.findings)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Medical Reports</h1>
        <p>View and manage radiology reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedReport ? '1fr 1.5fr' : '1fr', gap: '20px' }}>
        <div className="card">
          <h3>All Reports</h3>
          <div style={{ marginTop: '20px' }}>
            {reports.map(report => (
              <div
                key={report.id}
                onClick={() => handleViewReport(report)}
                style={{
                  padding: '15px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  background: selectedReport?.id === report.id ? '#ebf8ff' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>{report.patientName}</p>
                    <p style={{ fontSize: '14px', color: '#718096' }}>{report.type} - {report.date}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: report.status === 'Completed' ? '#c6f6d5' : '#fed7d7',
                    color: report.status === 'Completed' ? '#22543d' : '#742a2a'
                  }}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedReport && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Report Details</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleTextToSpeech} style={{ background: '#48bb78', color: 'white' }}>
                  <Volume2 size={16} style={{ marginRight: '5px' }} />
                  Listen
                </button>
                <button style={{ background: '#4299e1', color: 'white' }}>
                  <Download size={16} style={{ marginRight: '5px' }} />
                  Download
                </button>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Patient:</strong> {selectedReport.patientName}</p>
                <p><strong>Report ID:</strong> {selectedReport.id}</p>
                <p><strong>Date:</strong> {selectedReport.date}</p>
                <p><strong>Type:</strong> {selectedReport.type}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4>Findings</h4>
                <p style={{ marginTop: '10px', lineHeight: '1.6' }}>{selectedReport.fullReport.findings}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4>Impression</h4>
                <p style={{ marginTop: '10px', fontWeight: '600' }}>{selectedReport.fullReport.impression}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4>Recommendation</h4>
                <p style={{ marginTop: '10px', lineHeight: '1.6' }}>{selectedReport.fullReport.recommendation}</p>
              </div>

              <div style={{ padding: '15px', background: '#f7fafc', borderRadius: '8px' }}>
                <p><strong>AI Confidence:</strong> {selectedReport.fullReport.aiConfidence}%</p>
                <p><strong>Reviewed by:</strong> {selectedReport.fullReport.radiologist}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
