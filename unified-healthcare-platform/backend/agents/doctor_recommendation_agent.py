"""
Doctor Recommendation & Appointment Booking Agent
Finds best doctors and books appointments
"""

from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random

class DoctorRecommendationAgent:
    """Recommends doctors and manages appointments"""
    
    def __init__(self):
        # Mock database of doctors (in production, connect to real database)
        self.doctors_database = {
            'cardiologist': [
                {
                    'id': 'doc_001',
                    'name': 'Dr. Rajesh Kumar',
                    'specialization': 'Cardiology',
                    'qualification': 'MBBS, DM Cardiology',
                    'experience': 15,
                    'rating': 4.8,
                    'reviews': 342,
                    'hospital': 'Apollo Hospitals',
                    'location': 'Delhi',
                    'consultation_fee': 1500,
                    'availability': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    'time_slots': ['09:00-09:30', '09:30-10:00', '10:00-10:30', '14:00-14:30', '14:30-15:00'],
                    'languages': ['Hindi', 'English'],
                    'next_available': datetime.now() + timedelta(days=1),
                    'total_patients': 5000,
                    'emergency_available': True
                },
                {
                    'id': 'doc_002',
                    'name': 'Dr. Priya Patel',
                    'specialization': 'Cardiology',
                    'qualification': 'MBBS, MD, DM Cardiology',
                    'experience': 12,
                    'rating': 4.7,
                    'reviews': 298,
                    'hospital': 'Max Healthcare',
                    'location': 'Mumbai',
                    'consultation_fee': 1800,
                    'availability': ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
                    'time_slots': ['10:00-10:30', '10:30-11:00', '15:00-15:30', '15:30-16:00'],
                    'languages': ['Hindi', 'English', 'Marathi'],
                    'next_available': datetime.now() + timedelta(days=2),
                    'total_patients': 4200,
                    'emergency_available': False
                },
                {
                    'id': 'doc_003',
                    'name': 'Dr. Vikram Singh',
                    'specialization': 'Cardiology',
                    'qualification': 'MBBS, MD, DM Cardiology',
                    'experience': 18,
                    'rating': 4.9,
                    'reviews': 512,
                    'hospital': 'Fortis Healthcare',
                    'location': 'Bangalore',
                    'consultation_fee': 2000,
                    'availability': ['Mon', 'Tue', 'Wed', 'Thu'],
                    'time_slots': ['09:00-09:30', '09:30-10:00', '11:00-11:30', '16:00-16:30'],
                    'languages': ['Hindi', 'English', 'Kannada'],
                    'next_available': datetime.now() + timedelta(days=3),
                    'total_patients': 6000,
                    'emergency_available': True
                }
            ],
            'pulmonologist': [
                {
                    'id': 'doc_004',
                    'name': 'Dr. Arun Sharma',
                    'specialization': 'Pulmonology',
                    'qualification': 'MBBS, DM Respiratory Medicine',
                    'experience': 14,
                    'rating': 4.6,
                    'reviews': 215,
                    'hospital': 'Lilavati Hospital',
                    'location': 'Mumbai',
                    'consultation_fee': 1200,
                    'availability': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    'time_slots': ['08:00-08:30', '08:30-09:00', '13:00-13:30', '13:30-14:00'],
                    'languages': ['Hindi', 'English', 'Marathi', 'Gujarati'],
                    'next_available': datetime.now() + timedelta(days=1),
                    'total_patients': 3500,
                    'emergency_available': True
                }
            ],
            'neurologist': [
                {
                    'id': 'doc_005',
                    'name': 'Dr. Deepa Gupta',
                    'specialization': 'Neurology',
                    'qualification': 'MBBS, DM Neurology',
                    'experience': 11,
                    'rating': 4.7,
                    'reviews': 289,
                    'hospital': 'Breach Candy Hospital',
                    'location': 'Mumbai',
                    'consultation_fee': 1400,
                    'availability': ['Mon', 'Wed', 'Fri', 'Sat'],
                    'time_slots': ['10:00-10:30', '10:30-11:00', '15:00-15:30'],
                    'languages': ['Hindi', 'English', 'Marathi'],
                    'next_available': datetime.now() + timedelta(days=2),
                    'total_patients': 2800,
                    'emergency_available': False
                }
            ],
            'gastroenterologist': [
                {
                    'id': 'doc_006',
                    'name': 'Dr. Ravi Jain',
                    'specialization': 'Gastroenterology',
                    'qualification': 'MBBS, MD Gastroenterology',
                    'experience': 13,
                    'rating': 4.5,
                    'reviews': 178,
                    'hospital': 'BLK Super Specialty',
                    'location': 'Delhi',
                    'consultation_fee': 1300,
                    'availability': ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    'time_slots': ['09:00-09:30', '11:00-11:30', '14:00-14:30'],
                    'languages': ['Hindi', 'English', 'Punjabi'],
                    'next_available': datetime.now() + timedelta(days=1),
                    'total_patients': 3200,
                    'emergency_available': False
                }
            ],
            'general_physician': [
                {
                    'id': 'doc_007',
                    'name': 'Dr. Amit Kumar',
                    'specialization': 'General Medicine',
                    'qualification': 'MBBS, MD General Medicine',
                    'experience': 10,
                    'rating': 4.4,
                    'reviews': 567,
                    'hospital': 'City Hospital',
                    'location': 'Delhi',
                    'consultation_fee': 500,
                    'availability': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    'time_slots': ['08:00-08:30', '08:30-09:00', '09:00-09:30', '13:00-13:30', '13:30-14:00', '14:00-14:30'],
                    'languages': ['Hindi', 'English', 'Punjabi', 'Gujarati'],
                    'next_available': datetime.now() + timedelta(hours=3),
                    'total_patients': 8000,
                    'emergency_available': True
                }
            ]
        }
        
        self.specialization_mapping = {
            'pneumonia': ['pulmonologist', 'general_physician'],
            'covid19': ['pulmonologist', 'general_physician', 'infectious_disease'],
            'migraine': ['neurologist', 'general_physician'],
            'gastroenteritis': ['gastroenterologist', 'general_physician'],
            'acute_coronary_syndrome': ['cardiologist'],
            'angina_pectoris': ['cardiologist'],
            'common_cold': ['general_physician'],
            'diabetes': ['endocrinologist', 'general_physician'],
            'hypertension': ['cardiologist', 'general_physician'],
            'anxiety_disorder': ['psychiatrist', 'general_physician']
        }
    
    def recommend_doctors(self, disease: str, location: Optional[str] = None) -> List[Dict]:
        """
        Recommend doctors for a specific disease
        
        Args:
            disease: Disease name
            location: Optional location preference
        
        Returns:
            List of recommended doctors
        """
        # Get specialists for this disease
        specialists = self.specialization_mapping.get(disease, ['general_physician'])
        
        recommended = []
        
        for specialist in specialists:
            if specialist in self.doctors_database:
                doctors = self.doctors_database[specialist]
                
                # Filter by location if provided
                if location:
                    doctors = [d for d in doctors if location.lower() in d['location'].lower()]
                
                # Sort by rating
                doctors = sorted(doctors, key=lambda x: x['rating'], reverse=True)
                
                # Add disease context
                for doc in doctors:
                    doc_copy = doc.copy()
                    doc_copy['match_reason'] = f"Specialist in {specialist.replace('_', ' ').title()}"
                    doc_copy['suitability_score'] = doc_copy['rating']
                    recommended.append(doc_copy)
        
        # Remove duplicates and sort by rating
        seen = set()
        unique_recommended = []
        for doc in recommended:
            if doc['id'] not in seen:
                seen.add(doc['id'])
                unique_recommended.append(doc)
        
        unique_recommended.sort(key=lambda x: x['rating'], reverse=True)
        return unique_recommended[:5]  # Return top 5
    
    def get_available_slots(self, doctor_id: str, date: Optional[str] = None) -> List[Dict]:
        """Get available appointment slots for a doctor"""
        # Find doctor
        for specialty_docs in self.doctors_database.values():
            for doc in specialty_docs:
                if doc['id'] == doctor_id:
                    slots = []
                    
                    # Generate slots for next 7 days
                    for i in range(7):
                        current_date = datetime.now() + timedelta(days=i)
                        day_name = current_date.strftime('%a')
                        
                        # Check if doctor is available on this day
                        if day_name in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']:
                            if day_name in doc['availability']:
                                for time_slot in doc['time_slots']:
                                    # Randomly mark some as booked
                                    is_booked = random.random() < 0.3
                                    
                                    slots.append({
                                        'slot_id': f"{doctor_id}_{current_date.date()}_{time_slot}",
                                        'date': current_date.date().isoformat(),
                                        'time': time_slot,
                                        'available': not is_booked,
                                        'doctor_id': doctor_id
                                    })
                    
                    return slots
        
        return []
    
    def book_appointment(self, appointment_data: Dict) -> Dict:
        """
        Book an appointment
        
        Args:
            appointment_data: Dict with patient_id, doctor_id, slot_id, reason
        
        Returns:
            Appointment confirmation
        """
        appointment_id = f"APT_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Find the doctor
        doctor_info = None
        for specialty_docs in self.doctors_database.values():
            for doc in specialty_docs:
                if doc['id'] == appointment_data['doctor_id']:
                    doctor_info = doc
                    break
        
        if not doctor_info:
            return {'success': False, 'error': 'Doctor not found'}
        
        return {
            'success': True,
            'appointment_id': appointment_id,
            'patient_id': appointment_data['patient_id'],
            'doctor_name': doctor_info['name'],
            'doctor_specialization': doctor_info['specialization'],
            'hospital': doctor_info['hospital'],
            'location': doctor_info['location'],
            'slot': appointment_data.get('slot'),
            'consultation_fee': doctor_info['consultation_fee'],
            'booked_at': datetime.now().isoformat(),
            'reminder_set': True,
            'online_consultation_link': f"https://consult.health/{appointment_id}",
            'instructions': [
                'Please arrive 10 minutes before your appointment',
                'Bring your medical reports and insurance card',
                'Online consultation link will be sent via SMS and email',
                f"Cancellation must be done 24 hours before appointment"
            ]
        }
    
    def cancel_appointment(self, appointment_id: str) -> Dict:
        """Cancel an appointment"""
        return {
            'success': True,
            'appointment_id': appointment_id,
            'message': 'Appointment cancelled successfully',
            'refund_status': 'Refund will be processed within 3-5 working days',
            'cancelled_at': datetime.now().isoformat()
        }
