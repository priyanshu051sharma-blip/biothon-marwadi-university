"""
Mock Database Manager for HealthAI Pro
Implements in-memory database storage for demo/local run without Docker
"""

import random
from datetime import datetime
from typing import Dict, List, Optional

class DatabaseManager:
    def __init__(self):
        self.connected = False
        self.reports = {}
        self.assessments = {}
        
        # Initial mock patient records
        self.patients = {
            'P001': {
                'id': 'P001',
                'name': 'John Anderson',
                'age': 45,
                'gender': 'Male',
                'blood_group': 'O+',
                'conditions': ['Hypertension', 'Type 2 Diabetes'],
                'medications': ['Metformin 500mg', 'Lisinopril 10mg'],
                'vitals': {
                    'bp': '130/85',
                    'heart_rate': 78,
                    'temperature': 98.6,
                    'weight': 82,
                    'height': 175
                }
            },
            'P002': {
                'id': 'P002',
                'name': 'Sarah Miller',
                'age': 32,
                'gender': 'Female',
                'blood_group': 'A+',
                'conditions': ['Asthma'],
                'medications': ['Ventolin Inhaler', 'Montelukast 10mg'],
                'vitals': {
                    'bp': '118/76',
                    'heart_rate': 72,
                    'temperature': 98.4,
                    'weight': 65,
                    'height': 165
                }
            }
        }
        
        # Initial mock patient timelines
        self.timelines = {
            'P001': [
                {
                    'date': '2024-01-10',
                    'type': 'Radiology',
                    'title': 'Chest X-Ray Analysis',
                    'description': 'AI predicted Normal with 94.8% confidence'
                },
                {
                    'date': '2023-12-15',
                    'type': 'Symptom Analysis',
                    'title': 'Symptom Assessment',
                    'description': 'Complained of headache and dizziness. High risk of Hypertension.'
                }
            ],
            'P002': [
                {
                    'date': '2024-01-12',
                    'type': 'Symptom Analysis',
                    'title': 'Symptom Assessment',
                    'description': 'Complained of cough and fever. Predicted Common Cold.'
                }
            ]
        }

    async def connect(self):
        self.connected = True
        print("📁 Mock Database connected successfully")

    async def save_radiology_report(self, report_data: Dict) -> str:
        report_id = f"R{random.randint(1000, 9999)}"
        report_data['report_id'] = report_id
        self.reports[report_id] = report_data
        
        # Append to patient timeline if patient_id is valid
        p_id = report_data.get('patient_id') or 'P001'
        if p_id not in self.timelines:
            self.timelines[p_id] = []
        self.timelines[p_id].insert(0, {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'type': 'Radiology',
            'title': 'Radiology Scan Analysis',
            'description': f"AI predicted {report_data.get('diagnosis')} with {report_data.get('confidence')}% confidence"
        })
        return report_id

    async def save_symptom_analysis(self, analysis_data: Dict) -> str:
        analysis_id = f"A{random.randint(1000, 9999)}"
        analysis_data['analysis_id'] = analysis_id
        self.assessments[analysis_id] = analysis_data
        
        # Append to patient timeline if patient_id is valid
        p_id = analysis_data.get('patient_id') or 'P001'
        if p_id not in self.timelines:
            self.timelines[p_id] = []
            
        top_pred = "Unknown"
        if analysis_data.get('predictions') and len(analysis_data['predictions']) > 0:
            top_pred = analysis_data['predictions'][0].get('name') or analysis_data['predictions'][0].get('disease') or "Unknown"
            
        self.timelines[p_id].insert(0, {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'type': 'Symptom Analysis',
            'title': 'Symptom Assessment',
            'description': f"Symptom assessment complete. Top prediction: {top_pred}"
        })
        return analysis_id

    async def get_patient(self, patient_id: str) -> Optional[Dict]:
        return self.patients.get(patient_id, self.patients['P001'])

    async def get_patient_timeline(self, patient_id: str) -> List[Dict]:
        return self.timelines.get(patient_id, self.timelines['P001'])

    async def get_dashboard_stats(self) -> Dict:
        return {
            'total_patients': len(self.patients) + 2845,
            'ai_analyses': len(self.assessments) + 1456,
            'scans_completed': len(self.reports) + 1378,
            'avg_wait_time': '12 min',
            'ai_accuracy': 94.8
        }
