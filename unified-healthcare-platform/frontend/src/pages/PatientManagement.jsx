import { useState, useEffect } from 'react'
import { Users, Search, Plus, Eye, Edit, FileText, Calendar, Phone, Mail, MapPin, Activity, AlertCircle } from 'lucide-react'

function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('healthai-patients')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved patients:', e)
      }
    }
    return [
      {
        id: 'P001',
        name: 'John Anderson',
        age: 45,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+91 98765 43210',
        email: 'john.anderson@email.com',
        address: '123 Main Street, Downtown',
        lastVisit: '2024-01-10',
        nextAppointment: '2024-01-25',
        status: 'active',
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        recentScans: [
          { date: '2024-01-10', type: 'Chest X-Ray', result: 'Normal' },
          { date: '2023-12-15', type: 'Blood Test', result: 'HbA1c: 6.8%' }
        ],
        vitals: {
          bp: '130/85',
          heartRate: 78,
          temperature: 98.6,
          weight: 82,
          height: 175
        }
      },
      {
        id: 'P002',
        name: 'Sarah Miller',
        age: 32,
        gender: 'Female',
        bloodGroup: 'A+',
        phone: '+91 98765 43211',
        email: 'sarah.miller@email.com',
        address: '456 Park Avenue, North District',
        lastVisit: '2024-01-12',
        nextAppointment: '2024-02-05',
        status: 'active',
        conditions: ['Asthma'],
        medications: ['Ventolin Inhaler', 'Montelukast 10mg'],
        recentScans: [
          { date: '2024-01-12', type: 'Pulmonary Function Test', result: 'Mild Obstruction' },
          { date: '2023-11-20', type: 'Chest X-Ray', result: 'Clear' }
        ],
        vitals: {
          bp: '118/76',
          heartRate: 72,
          temperature: 98.4,
          weight: 65,
          height: 165
        }
      },
      {
        id: 'P003',
        name: 'Michael Chen',
        age: 58,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '+91 98765 43212',
        email: 'michael.chen@email.com',
        address: '789 Oak Street, East Side',
        lastVisit: '2024-01-08',
        nextAppointment: '2024-01-20',
        status: 'critical',
        conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
        medications: ['Atorvastatin 40mg', 'Aspirin 75mg', 'Metoprolol 50mg'],
        recentScans: [
          { date: '2024-01-08', type: 'ECG', result: 'Abnormal - ST Depression' },
          { date: '2024-01-05', type: 'Lipid Profile', result: 'LDL: 145 mg/dL' }
        ],
        vitals: {
          bp: '145/92',
          heartRate: 88,
          temperature: 98.8,
          weight: 90,
          height: 178
        }
      },
      {
        id: 'P004',
        name: 'Emma Wilson',
        age: 28,
        gender: 'Female',
        bloodGroup: 'AB+',
        phone: '+91 98765 43213',
        email: 'emma.wilson@email.com',
        address: '321 Elm Street, West End',
        lastVisit: '2024-01-14',
        nextAppointment: '2024-03-10',
        status: 'stable',
        conditions: ['Migraine'],
        medications: ['Sumatriptan 50mg PRN'],
        recentScans: [
          { date: '2024-01-14', type: 'MRI Brain', result: 'No Abnormalities' }
        ],
        vitals: {
          bp: '115/72',
          heartRate: 68,
          temperature: 98.2,
          weight: 58,
          height: 162
        }
      },
      {
        id: 'P005',
        name: 'David Kumar',
        age: 51,
        gender: 'Male',
        bloodGroup: 'O-',
        phone: '+91 98765 43214',
        email: 'david.kumar@email.com',
        address: '555 Maple Drive, South Quarter',
        lastVisit: '2024-01-11',
        nextAppointment: '2024-01-28',
        status: 'active',
        conditions: ['Chronic Kidney Disease Stage 3'],
        medications: ['Losartan 50mg', 'Furosemide 40mg'],
        recentScans: [
          { date: '2024-01-11', type: 'Kidney Function Test', result: 'eGFR: 52 mL/min' },
          { date: '2023-12-28', type: 'Ultrasound Kidneys', result: 'Bilateral Cortical Thinning' }
        ],
        vitals: {
          bp: '138/88',
          heartRate: 76,
          temperature: 98.5,
          weight: 78,
          height: 172
        }
      }
    ]
  })

  useEffect(() => {
    localStorage.setItem('healthai-patients', JSON.stringify(patients))
  }, [patients])

  const [formPatient, setFormPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    conditions: '',
    medications: ''
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormPatient(prev => ({ ...prev, [name]: value }))
  }

  const handleAddPatientSubmit = (e) => {
    e.preventDefault()
    if (!formPatient.name.trim()) return

    const newId = `P00${patients.length + 1}`
    const newPatient = {
      id: newId,
      name: formPatient.name,
      age: Number(formPatient.age) || 30,
      gender: formPatient.gender,
      bloodGroup: formPatient.bloodGroup,
      phone: formPatient.phone || '+91 98765 43210',
      email: formPatient.email || `${formPatient.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      address: formPatient.address || '123 Main Street',
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      conditions: formPatient.conditions ? formPatient.conditions.split(',').map(c => c.trim()) : [],
      medications: formPatient.medications ? formPatient.medications.split(',').map(m => m.trim()) : [],
      recentScans: [],
      vitals: {
        bp: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 70,
        height: 170
      }
    }

    setPatients(prev => [newPatient, ...prev])
    setShowAddModal(false)
    setFormPatient({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: '',
      conditions: '',
      medications: ''
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#27AE60'
      case 'stable': return '#3498DB'
      case 'critical': return '#E74C3C'
      default: return '#7F8C8D'
    }
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
            Patient Management
          </h1>
          <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
            Manage patient records, appointments, and medical history
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} />
          Add New Patient
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#7F8C8D' }} />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 48px',
              border: '2px solid #E1E8ED',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPatient ? '1fr 1.5fr' : '1fr', gap: '24px' }}>
        {/* Patients List */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E1E8ED' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} /> All Patients ({filteredPatients.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                style={{
                  padding: '16px',
                  background: selectedPatient?.id === patient.id ? '#E8F4FD' : '#F8FAFB',
                  border: `2px solid ${selectedPatient?.id === patient.id ? '#2E86AB' : '#E1E8ED'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', margin: '0 0 4px 0' }}>
                      {patient.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#7F8C8D', margin: 0 }}>
                      ID: {patient.id} • {patient.age}Y • {patient.gender}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    background: getStatusColor(patient.status),
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {patient.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#7F8C8D' }}>
                  <span>🩸 {patient.bloodGroup}</span>
                  <span>📅 Next: {patient.nextAppointment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E1E8ED' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
                  {selectedPatient.name}
                </h2>
                <p style={{ fontSize: '14px', color: '#7F8C8D', margin: 0 }}>
                  Patient ID: {selectedPatient.id}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '10px 16px',
                  background: '#F5F7FA',
                  border: '1px solid #E1E8ED',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2C3E50',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Edit size={14} />
                  Edit
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ marginBottom: '24px', padding: '20px', background: '#F8FAFB', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '16px' }}>
                Basic Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 4px 0' }}>Age / Gender</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                    {selectedPatient.age} years • {selectedPatient.gender}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 4px 0' }}>Blood Group</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                    {selectedPatient.bloodGroup}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> Phone
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                    {selectedPatient.phone}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={12} /> Email
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                    {selectedPatient.email}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Address
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                    {selectedPatient.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} /> Latest Vitals
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {Object.entries(selectedPatient.vitals).map(([key, value]) => (
                  <div key={key} style={{
                    padding: '14px',
                    background: '#F8FAFB',
                    borderRadius: '10px',
                    border: '1px solid #E1E8ED',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '11px', color: '#7F8C8D', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: 600 }}>
                      {key === 'bp' ? 'BP' : key === 'heartRate' ? 'HR' : key === 'temperature' ? 'Temp' : key}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      {value}
                      {key === 'temperature' && '°F'}
                      {key === 'heartRate' && ' bpm'}
                      {key === 'weight' && ' kg'}
                      {key === 'height' && ' cm'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> Medical Conditions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedPatient.conditions.map((condition, idx) => (
                  <span key={idx} style={{
                    padding: '8px 16px',
                    background: '#FFF4E6',
                    color: '#E67E22',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1px solid #E67E22'
                  }}>
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px' }}>
                Current Medications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPatient.medications.map((med, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    background: '#F8FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E1E8ED',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50'
                  }}>
                    💊 {med}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Scans */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0A2540', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} /> Recent Scans & Tests
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedPatient.recentScans.map((scan, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    background: '#F8FAFB',
                    borderRadius: '10px',
                    border: '1px solid #E1E8ED'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A2540', margin: '0 0 4px 0' }}>
                          {scan.type}
                        </p>
                        <p style={{ fontSize: '12px', color: '#7F8C8D', margin: 0 }}>
                          {scan.date}
                        </p>
                      </div>
                      <button style={{
                        padding: '6px 12px',
                        background: '#2E86AB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Eye size={12} />
                        View
                      </button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#2C3E50', margin: 0 }}>
                      Result: <strong>{scan.result}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '36px',
            maxWidth: '650px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', marginBottom: '24px' }}>
              Add New Patient Record
            </h3>

            <form onSubmit={handleAddPatientSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formPatient.name}
                  onChange={handleFormChange}
                  placeholder="E.g., John Anderson"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  value={formPatient.age}
                  onChange={handleFormChange}
                  placeholder="E.g., 45"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Gender</label>
                <select
                  name="gender"
                  value={formPatient.gender}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formPatient.bloodGroup}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formPatient.phone}
                  onChange={handleFormChange}
                  placeholder="E.g., +91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formPatient.email}
                  onChange={handleFormChange}
                  placeholder="E.g., john@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Home Address</label>
                <input
                  type="text"
                  name="address"
                  value={formPatient.address}
                  onChange={handleFormChange}
                  placeholder="E.g., 123 Main Street, Downtown"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Medical Conditions (Comma separated)</label>
                <input
                  type="text"
                  name="conditions"
                  value={formPatient.conditions}
                  onChange={handleFormChange}
                  placeholder="E.g., Hypertension, Type 2 Diabetes"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>Current Medications (Comma separated)</label>
                <input
                  type="text"
                  name="medications"
                  value={formPatient.medications}
                  onChange={handleFormChange}
                  placeholder="E.g., Metformin 500mg, Lisinopril 10mg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E1E8ED',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1', marginTop: '24px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Create Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '14px 24px',
                    background: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientManagement
