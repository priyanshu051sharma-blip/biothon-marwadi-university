import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, CheckCircle, User, Award, DollarSign } from 'lucide-react'
import './PatientPortal.css'

function PatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDept, setSelectedDept] = useState('Cardiology')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [success, setSuccess] = useState(false)

  const doctorsList = [
    { name: 'Dr. Sarah Johnson', specialty: 'Pulmonologist', exp: 12, rating: 4.9, fee: 500, slots: ['09:00 AM', '11:30 AM', '02:30 PM'] },
    { name: 'Dr. Robert Carter', specialty: 'Cardiologist', exp: 18, rating: 4.8, fee: 600, slots: ['10:00 AM', '12:00 PM', '04:00 PM'] },
    { name: 'Dr. Evelyn Martinez', specialty: 'Neurologist', exp: 15, rating: 4.7, fee: 550, slots: ['11:00 AM', '01:30 PM', '03:30 PM'] },
    { name: 'Dr. John Watson', specialty: 'General Practitioner', exp: 10, rating: 4.6, fee: 400, slots: ['09:30 AM', '03:00 PM', '05:00 PM'] }
  ]

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    const saved = localStorage.getItem('booked-appointments')
    if (saved) {
      setAppointments(JSON.parse(saved))
    } else {
      const initial = [
        { id: 'APT-8712', doctor: 'Dr. Sarah Johnson', specialty: 'Pulmonologist', date: '2026-06-18', time: '02:30 PM', status: 'Confirmed' }
      ]
      setAppointments(initial)
      localStorage.setItem('booked-appointments', JSON.stringify(initial))
    }
  }

  const handleBook = (e) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      alert('Please fill out all booking fields')
      return
    }

    const doc = doctorsList.find(x => x.name === selectedDoctor)
    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: doc.name,
      specialty: doc.specialty,
      date: selectedDate,
      time: selectedSlot,
      status: 'Confirmed'
    }

    const updated = [newApt, ...appointments]
    setAppointments(updated)
    localStorage.setItem('booked-appointments', JSON.stringify(updated))
    
    // Reset form
    setSelectedDoctor('')
    setSelectedDate('')
    setSelectedSlot('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="patient-appointments">
      <div className="status-header">
        <CalendarIcon size={32} color="#9B59B6" />
        <div>
          <h2>Clinic Consultation Booking</h2>
          <p>Book video or in-person consultations with our on-duty clinical specialists.</p>
        </div>
      </div>

      <div className="dashboard-split-grid">
        {/* Booking Form */}
        <div className="split-card-pt">
          <div className="card-header-pt">
            <h4>Schedule New Consultation</h4>
          </div>
          <div className="card-body-pt">
            {success && (
              <div className="success-banner-pt">
                <CheckCircle size={18} />
                <span>Appointment Booked Successfully!</span>
              </div>
            )}
            
            <form onSubmit={handleBook} className="pt-booking-form">
              <div className="form-group">
                <label>Select Department</label>
                <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Practice">General Practice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Select Specialist</label>
                <select 
                  value={selectedDoctor} 
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">Choose Practitioner...</option>
                  {doctorsList.map((doc, idx) => (
                    <option key={idx} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="doctor-profile-preview animate-fade-in">
                  <div className="doc-prev-row">
                    <User size={16} />
                    <span>Rating: <strong>{doctorsList.find(x => x.name === selectedDoctor).rating} ★</strong></span>
                  </div>
                  <div className="doc-prev-row">
                    <Award size={16} />
                    <span>Experience: <strong>{doctorsList.find(x => x.name === selectedDoctor).exp} Years</strong></span>
                  </div>
                  <div className="doc-prev-row">
                    <DollarSign size={16} />
                    <span>Consultation Fee: <strong>₹{doctorsList.find(x => x.name === selectedDoctor).fee}</strong></span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Preferred Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  required
                />
              </div>

              {selectedDoctor && (
                <div className="form-group">
                  <label>Available Slots</label>
                  <div className="slots-grid-pt">
                    {doctorsList.find(x => x.name === selectedDoctor).slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-chip-pt ${selectedSlot === slot ? 'active' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn-pt-submit">
                Book Consultation
              </button>
            </form>
          </div>
        </div>

        {/* Booked list */}
        <div className="split-card-pt">
          <div className="card-header-pt">
            <h4>Your Active Bookings</h4>
          </div>
          <div className="card-body-pt appointments-list-pt">
            {appointments.length === 0 ? (
              <p className="empty-text-pt">No active consultations booked.</p>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="apt-item-card-pt">
                  <div className="apt-card-header-pt">
                    <h5>{apt.doctor}</h5>
                    <span className="badge-confirmed">{apt.status}</span>
                  </div>
                  <p className="apt-spec">{apt.specialty}</p>
                  <div className="apt-footer-pt">
                    <div className="footer-meta">
                      <CalendarIcon size={12} />
                      <span>{apt.date}</span>
                    </div>
                    <div className="footer-meta">
                      <Clock size={12} />
                      <span>{apt.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments
