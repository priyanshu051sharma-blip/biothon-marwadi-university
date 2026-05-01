"""
Medicine & Blood Bank Availability Agent
Finds medicines and blood types availability
"""

from typing import List, Dict, Optional
from datetime import datetime

class MedicineBloodBankAgent:
    """Manages medicine and blood bank inventory"""
    
    def __init__(self):
        # Mock database of medicines
        self.medicines_database = {
            'amoxicillin': {
                'generic_name': 'Amoxicillin',
                'brand_names': ['Amoxil', 'Amoxi', 'Moxatag'],
                'category': 'Antibiotic',
                'usage': 'Bacterial infections',
                'dosage': ['250mg', '500mg', '1000mg'],
                'side_effects': ['Nausea', 'Diarrhea', 'Allergic reactions'],
                'price_range': [100, 500],
                'manufacturers': ['GSK', 'Cipla', 'Ranbaxy'],
                'requires_prescription': True,
                'availability_locations': [
                    {'pharmacy': 'HealthPlus Pharmacy', 'location': 'Delhi', 'stock': 150, 'price': 250},
                    {'pharmacy': 'Apollo Pharmacy', 'location': 'Mumbai', 'stock': 200, 'price': 280},
                    {'pharmacy': 'Medplus', 'location': 'Bangalore', 'stock': 100, 'price': 240}
                ]
            },
            'aspirin': {
                'generic_name': 'Aspirin',
                'brand_names': ['Ecosprin', 'Ascard', 'Levasprin'],
                'category': 'Pain reliever / Anticoagulant',
                'usage': 'Pain relief, heart disease prevention',
                'dosage': ['75mg', '150mg', '300mg', '500mg'],
                'side_effects': ['Stomach upset', 'Bleeding risk', 'Allergic reactions'],
                'price_range': [50, 200],
                'manufacturers': ['Sun Pharma', 'Bayer', 'Cipla'],
                'requires_prescription': False,
                'availability_locations': [
                    {'pharmacy': 'Netmeds', 'location': 'Pan India', 'stock': 5000, 'price': 80},
                    {'pharmacy': 'Apollo Pharmacy', 'location': 'Pan India', 'stock': 3000, 'price': 100},
                    {'pharmacy': 'Local Chemist', 'location': 'All cities', 'stock': 1000, 'price': 75}
                ]
            },
            'metformin': {
                'generic_name': 'Metformin',
                'brand_names': ['Glucophage', 'Diabeta', 'Glycomet'],
                'category': 'Antidiabetic',
                'usage': 'Type 2 diabetes management',
                'dosage': ['500mg', '850mg', '1000mg'],
                'side_effects': ['Diarrhea', 'Nausea', 'Metallic taste'],
                'price_range': [150, 600],
                'manufacturers': ['Cipla', 'Lupin', 'Dr. Reddy'],
                'requires_prescription': True,
                'availability_locations': [
                    {'pharmacy': 'Apollo Pharmacy', 'location': 'Pan India', 'stock': 2000, 'price': 300},
                    {'pharmacy': 'Medplus', 'location': 'Pan India', 'stock': 1500, 'price': 280},
                    {'pharmacy': 'HealthPlus', 'location': 'Pan India', 'stock': 1200, 'price': 320}
                ]
            },
            'paracetamol': {
                'generic_name': 'Paracetamol',
                'brand_names': ['Crocin', 'Dolo', 'Tylenol'],
                'category': 'Pain reliever / Fever reducer',
                'usage': 'Pain relief, fever reduction',
                'dosage': ['250mg', '500mg', '1000mg'],
                'side_effects': ['Rare liver damage (overdose)', 'Allergic reactions'],
                'price_range': [20, 150],
                'manufacturers': ['GSK', 'Micro Labs', 'Cipla'],
                'requires_prescription': False,
                'availability_locations': [
                    {'pharmacy': 'Any Pharmacy', 'location': 'Pan India', 'stock': 10000, 'price': 50},
                    {'pharmacy': 'Online Pharmacies', 'location': 'Pan India', 'stock': 5000, 'price': 40}
                ]
            },
            'antibiotics_general': {
                'generic_name': 'General Antibiotics',
                'brand_names': ['Azithromycin', 'Cephalexin', 'Ciprofloxacin'],
                'category': 'Antibiotic',
                'usage': 'Various bacterial infections',
                'dosage': ['500mg', '1000mg', '1500mg'],
                'side_effects': ['Nausea', 'Allergic reactions', 'Diarrhea'],
                'price_range': [150, 1000],
                'manufacturers': ['Cipla', 'Ranbaxy', 'Lupin'],
                'requires_prescription': True,
                'availability_locations': [
                    {'pharmacy': 'Apollo Pharmacy', 'location': 'Pan India', 'stock': 5000, 'price': 500},
                    {'pharmacy': 'Medplus', 'location': 'Pan India', 'stock': 3000, 'price': 550}
                ]
            }
        }
        
        # Blood bank database
        self.blood_banks = {
            'delhi': [
                {
                    'name': 'Delhi Blood Bank',
                    'location': 'New Delhi',
                    'phone': '+91-11-XXXXXXXX',
                    'address': 'Sector 8, R.K. Puram, New Delhi',
                    'available_units': {
                        'O+': 50,
                        'O-': 15,
                        'A+': 35,
                        'A-': 10,
                        'B+': 40,
                        'B-': 12,
                        'AB+': 20,
                        'AB-': 8
                    },
                    'emergency_24_7': True,
                    'home_delivery': True,
                    'donation_camp': True
                },
                {
                    'name': 'Red Cross Blood Bank',
                    'location': 'Delhi',
                    'phone': '+91-11-YYYYYYYY',
                    'address': 'ITO, New Delhi',
                    'available_units': {
                        'O+': 60,
                        'O-': 20,
                        'A+': 40,
                        'A-': 12,
                        'B+': 50,
                        'B-': 15,
                        'AB+': 25,
                        'AB-': 10
                    },
                    'emergency_24_7': True,
                    'home_delivery': True,
                    'donation_camp': False
                }
            ],
            'mumbai': [
                {
                    'name': 'Mumbai Blood Bank',
                    'location': 'Mumbai',
                    'phone': '+91-22-XXXXXXXX',
                    'address': 'Dadar East, Mumbai',
                    'available_units': {
                        'O+': 45,
                        'O-': 14,
                        'A+': 30,
                        'A-': 9,
                        'B+': 35,
                        'B-': 11,
                        'AB+': 18,
                        'AB-': 7
                    },
                    'emergency_24_7': True,
                    'home_delivery': False,
                    'donation_camp': True
                },
                {
                    'name': 'Lilavati Blood Bank',
                    'location': 'Mumbai',
                    'phone': '+91-22-ZZZZZZZZ',
                    'address': 'Bandra, Mumbai',
                    'available_units': {
                        'O+': 55,
                        'O-': 18,
                        'A+': 38,
                        'A-': 11,
                        'B+': 42,
                        'B-': 13,
                        'AB+': 22,
                        'AB-': 9
                    },
                    'emergency_24_7': False,
                    'home_delivery': True,
                    'donation_camp': True
                }
            ],
            'bangalore': [
                {
                    'name': 'Bangalore Blood Bank',
                    'location': 'Bangalore',
                    'phone': '+91-80-XXXXXXXX',
                    'address': 'Indiranagar, Bangalore',
                    'available_units': {
                        'O+': 40,
                        'O-': 12,
                        'A+': 28,
                        'A-': 8,
                        'B+': 32,
                        'B-': 10,
                        'AB+': 16,
                        'AB-': 6
                    },
                    'emergency_24_7': True,
                    'home_delivery': True,
                    'donation_camp': True
                }
            ]
        }
    
    def find_medicines(self, medicine_name: str, location: Optional[str] = None) -> List[Dict]:
        """
        Find medicines and their availability
        
        Args:
            medicine_name: Name or partial name of medicine
            location: Optional location to filter results
        
        Returns:
            List of available medicines with pharmacy info
        """
        results = []
        
        medicine_name_lower = medicine_name.lower()
        
        for med_key, med_data in self.medicines_database.items():
            if (medicine_name_lower in med_key or
                medicine_name_lower in med_data['generic_name'].lower() or
                any(medicine_name_lower in brand.lower() for brand in med_data['brand_names'])):
                
                locations = med_data['availability_locations']
                
                if location:
                    locations = [
                        l for l in locations 
                        if location.lower() in l['location'].lower()
                    ]
                
                results.append({
                    'generic_name': med_data['generic_name'],
                    'brand_names': med_data['brand_names'],
                    'category': med_data['category'],
                    'usage': med_data['usage'],
                    'dosage_options': med_data['dosage'],
                    'side_effects': med_data['side_effects'],
                    'price_range': med_data['price_range'],
                    'requires_prescription': med_data['requires_prescription'],
                    'available_at': locations
                })
        
        return results
    
    def find_blood(self, blood_type: str, location: Optional[str] = None) -> List[Dict]:
        """
        Find blood type availability
        
        Args:
            blood_type: Blood type (O+, O-, A+, etc.)
            location: City name
        
        Returns:
            List of blood banks with availability
        """
        blood_type = blood_type.upper()
        
        if not location:
            # Search all locations
            available_banks = []
            for city_banks in self.blood_banks.values():
                available_banks.extend(city_banks)
        else:
            location_lower = location.lower()
            available_banks = []
            for city, banks in self.blood_banks.items():
                if location_lower in city:
                    available_banks.extend(banks)
        
        results = []
        
        for bank in available_banks:
            blood_units = bank['available_units'].get(blood_type, 0)
            
            if blood_units > 0 or blood_type == 'any':
                availability_level = 'Critical' if blood_units < 5 else 'Low' if blood_units < 10 else 'Available'
                
                results.append({
                    'bank_name': bank['name'],
                    'location': bank['location'],
                    'phone': bank['phone'],
                    'address': bank['address'],
                    'blood_type': blood_type,
                    'available_units': blood_units,
                    'availability_level': availability_level,
                    'emergency_24_7': bank['emergency_24_7'],
                    'home_delivery': bank['home_delivery'],
                    'donation_camp': bank['donation_camp'],
                    'all_available_types': bank['available_units']
                })
        
        return results
    
    def reserve_blood(self, blood_bank_id: str, blood_type: str, units: int, patient_info: Dict) -> Dict:
        """Reserve blood units"""
        reservation_id = f"RES_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return {
            'success': True,
            'reservation_id': reservation_id,
            'blood_type': blood_type,
            'units_reserved': units,
            'reserved_at': datetime.now().isoformat(),
            'valid_for_hours': 48,
            'collection_instructions': [
                'Bring valid ID and prescription',
                'Arrive at least 30 minutes before collection',
                'Keep blood units at 2-8°C after collection',
                'Ensure proper transportation in cold chain'
            ],
            'cost_per_unit': 2500,
            'total_cost': units * 2500
        }
    
    def search_medication_for_disease(self, disease: str) -> List[Dict]:
        """Get recommended medications for a disease"""
        disease_medications = {
            'pneumonia': [
                {'medicine': 'antibiotics_general', 'dosage': '500-1000mg', 'duration': '7-14 days'},
                {'medicine': 'paracetamol', 'dosage': '500mg', 'duration': '3-5 days'}
            ],
            'covid19': [
                {'medicine': 'paracetamol', 'dosage': '500mg', 'duration': '5-7 days'},
                {'medicine': 'antibiotics_general', 'dosage': '500mg', 'duration': '5-7 days (if bacterial)'}
            ],
            'migraine': [
                {'medicine': 'aspirin', 'dosage': '500mg', 'duration': 'as needed'}
            ],
            'gastroenteritis': [
                {'medicine': 'paracetamol', 'dosage': '500mg', 'duration': '3-5 days'},
                {'medicine': 'aspirin', 'dosage': '250-500mg', 'duration': 'as needed'}
            ],
            'acute_coronary_syndrome': [
                {'medicine': 'aspirin', 'dosage': '75-300mg', 'duration': 'ongoing'},
                {'medicine': 'antibiotics_general', 'dosage': 'as prescribed', 'duration': 'as needed'}
            ]
        }
        
        medications = disease_medications.get(disease, [])
        results = []
        
        for med_info in medications:
            med_data = self.medicines_database.get(med_info['medicine'])
            if med_data:
                results.append({
                    'generic_name': med_data['generic_name'],
                    'brand_names': med_data['brand_names'],
                    'recommended_dosage': med_info['dosage'],
                    'duration': med_info['duration'],
                    'price_range': med_data['price_range'],
                    'requires_prescription': med_data['requires_prescription']
                })
        
        return results
