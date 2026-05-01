import { useState } from 'react'
import { UserCheck, Building2, FlaskConical, Calendar, MapPin, Star } from 'lucide-react'
import './SmartCareNavigator.css'

function SmartCareNavigator({ analysis }) {
  const [doctors] = useState([
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      rating: 4.9,
      distance: '2.3 km',
      availability: 'Tomorrow 10:00 AM',
      insurance: 'Accepted',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    {
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      rating: 4.7,
      distance: '3.8 km',
      availability: 'Today 4:00 PM',
      insurance: 'Accepted',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
    }
  ])

  const [hospitals] = useState([
    {
      name: 'Apollo Hospital',
      department: 'Cardiology',
      distance: '2.1 km',
      bedAvailability: 78,
      erWait: '22 min',
      rating: 4.8
    },
    {
      name: 'Fortis Healthcare',
      department: 'Cardiology',
      distance: '4.5 km',
      bedAvailability: 45,
      erWait: '35 min',
      rating: 4.6
    }
  ])

  const [labs] = useState([
    {
      name: 'SRL Diagnostics',
      distance: '1.8 km',
      tests: ['ECG', 'Troponin', 'Lipid Panel'],
      waitTime: '15 min',
      cost: '$180-250'
    },
    {
      name: 'Dr. Lal PathLabs',
      distance: '2.9 km',
      tests: ['ECG', 'Troponin'],
      waitTime: '25 min',
      cost: '$150-220'
    }
  ])

  const handleBookAppointment = (doctor) => {
    alert(`Booking appointment with ${doctor.name}\nConfirmation: APT-${Date.now()}`)
  }

  return (
    <div className="smart-care-navigator">
      <div className="panel-card">
        <h3><UserCheck size={20} /> Recommended Specialists</h3>
        {doctors.map((doctor, idx) => (
          <div key={idx} className="doctor-card">
            <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
            <div className="doctor-info">
              <h4>{doctor.name}</h4>
              <p className="specialty">{doctor.specialty}</p>
              <div className="doctor-meta">
                <span><Star size={14} fill="gold" stroke="gold" /> {doctor.rating}</span>
                <span><MapPin size={14} /> {doctor.distance}</span>
              </div>
              <p className="availability">
                <Calendar size={14} /> {doctor.availability}
              </p>
              <button 
                className="book-btn"
                onClick={() => handleBookAppointment(doctor)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <h3><Building2 size={20} /> Nearby Hospitals</h3>
        {hospitals.map((hospital, idx) => (
          <div key={idx} className="hospital-card">
            <div className="hospital-header">
              <h4>{hospital.name}</h4>
              <span className="rating">
                <Star size={14} fill="gold" stroke="gold" /> {hospital.rating}
              </span>
            </div>
            <p className="department">{hospital.department} Department</p>
            <div className="hospital-stats">
              <div className="stat">
                <span className="stat-label">Bed Availability</span>
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill"
                    style={{ 
                      width: `${hospital.bedAvailability}%`,
                      background: hospital.bedAvailability > 60 ? 'var(--routine-green)' : 'var(--urgent-orange)'
                    }}
                  />
                </div>
                <span className="stat-value">{hospital.bedAvailability}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">ER Wait Time</span>
                <span className="stat-value">{hospital.erWait}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Distance</span>
                <span className="stat-value">{hospital.distance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <h3><FlaskConical size={20} /> Diagnostic Labs</h3>
        {labs.map((lab, idx) => (
          <div key={idx} className="lab-card">
            <h4>{lab.name}</h4>
            <div className="lab-tests">
              {lab.tests.map((test, i) => (
                <span key={i} className="test-badge">{test}</span>
              ))}
            </div>
            <div className="lab-meta">
              <span><MapPin size={14} /> {lab.distance}</span>
              <span>Wait: {lab.waitTime}</span>
              <span className="lab-cost">{lab.cost}</span>
            </div>
            <button className="schedule-btn">Schedule Tests</button>
          </div>
        ))}
      </div>

      {analysis && (
        <div className="panel-card action-plan">
          <h3>Recommended Action Plan</h3>
          <ol className="action-steps">
            <li>Book cardiologist within 24 hours</li>
            <li>Schedule ECG and Troponin test</li>
            <li>Bring current medication list</li>
            <li>Monitor symptoms - call 911 if worsening</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default SmartCareNavigator
