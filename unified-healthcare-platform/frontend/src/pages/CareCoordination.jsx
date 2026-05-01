import { useState } from 'react'
import { Building2, Bed, Pill, Droplet, Activity, MapPin, Phone, Clock, CheckCircle, AlertTriangle, Search } from 'lucide-react'

function CareCoordination() {
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const hospitals = [
    {
      id: 1,
      name: 'City General Hospital',
      location: 'Downtown Medical Center, Sector 12',
      distance: '2.3 km',
      phone: '+91 98765 43210',
      rating: 4.8,
      beds: {
        general: { available: 45, total: 120, status: 'good' },
        icu: { available: 8, total: 20, status: 'moderate' },
        emergency: { available: 12, total: 30, status: 'good' }
      },
      bloodBank: {
        'A+': { units: 25, status: 'good' },
        'A-': { units: 8, status: 'low' },
        'B+': { units: 18, status: 'good' },
        'B-': { units: 5, status: 'critical' },
        'O+': { units: 32, status: 'good' },
        'O-': { units: 12, status: 'moderate' },
        'AB+': { units: 10, status: 'moderate' },
        'AB-': { units: 3, status: 'critical' }
      },
      medicines: [
        { name: 'Paracetamol 500mg', stock: 500, status: 'good' },
        { name: 'Amoxicillin 250mg', stock: 150, status: 'good' },
        { name: 'Insulin (Vial)', stock: 45, status: 'moderate' },
        { name: 'Aspirin 75mg', stock: 320, status: 'good' },
        { name: 'Ventolin Inhaler', stock: 25, status: 'low' }
      ],
      facilities: ['24/7 Emergency', 'ICU', 'Trauma Center', 'Blood Bank', 'Pharmacy']
    },
    {
      id: 2,
      name: 'Apollo Medical Center',
      location: 'North Avenue, Medical District',
      distance: '4.1 km',
      phone: '+91 98765 43211',
      rating: 4.9,
      beds: {
        general: { available: 62, total: 150, status: 'good' },
        icu: { available: 5, total: 25, status: 'low' },
        emergency: { available: 18, total: 35, status: 'good' }
      },
      bloodBank: {
        'A+': { units: 30, status: 'good' },
        'A-': { units: 12, status: 'moderate' },
        'B+': { units: 22, status: 'good' },
        'B-': { units: 8, status: 'moderate' },
        'O+': { units: 40, status: 'good' },
        'O-': { units: 15, status: 'good' },
        'AB+': { units: 14, status: 'good' },
        'AB-': { units: 6, status: 'moderate' }
      },
      medicines: [
        { name: 'Paracetamol 500mg', stock: 650, status: 'good' },
        { name: 'Amoxicillin 250mg', stock: 200, status: 'good' },
        { name: 'Insulin (Vial)', stock: 60, status: 'good' },
        { name: 'Aspirin 75mg', stock: 400, status: 'good' },
        { name: 'Ventolin Inhaler', stock: 40, status: 'good' }
      ],
      facilities: ['24/7 Emergency', 'ICU', 'NICU', 'Cardiology', 'Blood Bank', 'Pharmacy', 'Ambulance']
    },
    {
      id: 3,
      name: 'Max Healthcare',
      location: 'South Extension, Block A',
      distance: '5.8 km',
      phone: '+91 98765 43212',
      rating: 4.7,
      beds: {
        general: { available: 28, total: 100, status: 'moderate' },
        icu: { available: 3, total: 15, status: 'critical' },
        emergency: { available: 8, total: 25, status: 'moderate' }
      },
      bloodBank: {
        'A+': { units: 20, status: 'moderate' },
        'A-': { units: 6, status: 'low' },
        'B+': { units: 15, status: 'moderate' },
        'B-': { units: 4, status: 'critical' },
        'O+': { units: 28, status: 'good' },
        'O-': { units: 10, status: 'moderate' },
        'AB+': { units: 8, status: 'moderate' },
        'AB-': { units: 2, status: 'critical' }
      },
      medicines: [
        { name: 'Paracetamol 500mg', stock: 400, status: 'good' },
        { name: 'Amoxicillin 250mg', stock: 120, status: 'moderate' },
        { name: 'Insulin (Vial)', stock: 35, status: 'moderate' },
        { name: 'Aspirin 75mg', stock: 280, status: 'good' },
        { name: 'Ventolin Inhaler', stock: 18, status: 'low' }
      ],
      facilities: ['24/7 Emergency', 'ICU', 'Neurology', 'Blood Bank', 'Pharmacy']
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#27AE60'
      case 'moderate': return '#F39C12'
      case 'low': return '#E67E22'
      case 'critical': return '#E74C3C'
      default: return '#7F8C8D'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return <CheckCircle size={16} />
      case 'moderate': return <Clock size={16} />
      case 'low': return <AlertTriangle size={16} />
      case 'critical': return <AlertTriangle size={16} />
      default: return <Activity size={16} />
    }
  }

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0A2540', margin: '0 0 8px 0' }}>
          Care Coordination & Hospital Resources
        </h1>
        <p style={{ fontSize: '15px', color: '#7F8C8D', margin: 0 }}>
          Real-time availability of beds, medicines, and blood across hospitals
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#7F8C8D' }} />
          <input
            type="text"
            placeholder="Search hospitals by name or location..."
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

      {/* Hospitals List */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {filteredHospitals.map((hospital) => (
          <div key={hospital.id} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #E1E8ED'
          }}>
            {/* Hospital Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      {hospital.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ color: '#F39C12', fontSize: '14px' }}>★</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>{hospital.rating}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#7F8C8D" />
                    <span style={{ fontSize: '13px', color: '#7F8C8D' }}>{hospital.location} • {hospital.distance}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#7F8C8D" />
                    <span style={{ fontSize: '13px', color: '#7F8C8D' }}>{hospital.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {hospital.facilities.map((facility, idx) => (
                    <span key={idx} style={{
                      padding: '4px 12px',
                      background: '#E8F4FD',
                      color: '#2E86AB',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedHospital(selectedHospital?.id === hospital.id ? null : hospital)}
                style={{
                  padding: '10px 20px',
                  background: selectedHospital?.id === hospital.id ? '#2E86AB' : '#F5F7FA',
                  color: selectedHospital?.id === hospital.id ? 'white' : '#2E86AB',
                  border: `1px solid ${selectedHospital?.id === hospital.id ? '#2E86AB' : '#E1E8ED'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {selectedHospital?.id === hospital.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: selectedHospital?.id === hospital.id ? '24px' : 0 }}>
              <div style={{ padding: '16px', background: '#F8FAFB', borderRadius: '12px', border: '1px solid #E1E8ED' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Bed size={18} color="#2E86AB" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D' }}>BEDS AVAILABLE</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  {hospital.beds.general.available + hospital.beds.icu.available + hospital.beds.emergency.available}
                </p>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFB', borderRadius: '12px', border: '1px solid #E1E8ED' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Droplet size={18} color="#E74C3C" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D' }}>BLOOD UNITS</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  {Object.values(hospital.bloodBank).reduce((sum, b) => sum + b.units, 0)}
                </p>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFB', borderRadius: '12px', border: '1px solid #E1E8ED' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Pill size={18} color="#27AE60" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D' }}>MEDICINES</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  {hospital.medicines.length}+
                </p>
              </div>
            </div>

            {/* Detailed View */}
            {selectedHospital?.id === hospital.id && (
              <div style={{ paddingTop: '24px', borderTop: '1px solid #E1E8ED' }}>
                {/* Bed Availability */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bed size={18} /> Bed Availability
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {Object.entries(hospital.beds).map(([type, data]) => (
                      <div key={type} style={{
                        padding: '16px',
                        background: '#F8FAFB',
                        borderRadius: '12px',
                        border: `2px solid ${getStatusColor(data.status)}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#7F8C8D', textTransform: 'uppercase' }}>
                            {type}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getStatusColor(data.status) }}>
                            {getStatusIcon(data.status)}
                          </div>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: 700, color: '#0A2540', margin: '0 0 4px 0' }}>
                          {data.available} / {data.total}
                        </p>
                        <div style={{ height: '6px', background: '#E1E8ED', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${(data.available / data.total) * 100}%`,
                            height: '100%',
                            background: getStatusColor(data.status),
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blood Bank */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Droplet size={18} /> Blood Bank Inventory
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {Object.entries(hospital.bloodBank).map(([type, data]) => (
                      <div key={type} style={{
                        padding: '14px',
                        background: '#F8FAFB',
                        borderRadius: '10px',
                        border: `2px solid ${getStatusColor(data.status)}`,
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: '#E74C3C', margin: '0 0 4px 0' }}>
                          {type}
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A2540', margin: '0 0 4px 0' }}>
                          {data.units}
                        </p>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: getStatusColor(data.status),
                          textTransform: 'uppercase'
                        }}>
                          {data.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medicines */}
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={18} /> Medicine Availability
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {hospital.medicines.map((medicine, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 16px',
                        background: '#F8FAFB',
                        borderRadius: '10px',
                        border: '1px solid #E1E8ED'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>
                          {medicine.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A2540' }}>
                            {medicine.stock} units
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            background: getStatusColor(medicine.status),
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {medicine.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CareCoordination
