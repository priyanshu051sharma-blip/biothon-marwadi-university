"""
Advanced Disease Prediction Agent
Uses comprehensive Bayesian inference with multiple factors
"""

from typing import List, Dict, Optional
import math
from datetime import datetime

class AdvancedDiseasePredictionAgent:
    """Predicts diseases with detailed explanations"""
    
    def __init__(self):
        # Comprehensive disease-symptom probability matrix
        self.disease_database = {
            'pneumonia': {
                'symptoms': {
                    'cough': 0.88,
                    'fever': 0.82,
                    'shortness_of_breath': 0.65,
                    'chest_pain': 0.45,
                    'fatigue': 0.60,
                },
                'metadata': {
                    'name': 'Pneumonia',
                    'icd10': 'J18.9',
                    'urgency': 'urgent',
                    'description': 'Bacterial, viral, or fungal infection of lung alveoli',
                    'common_treatments': ['Antibiotics', 'Rest', 'Fluids', 'Oxygen therapy'],
                    'specialists': ['Pulmonologist', 'General Physician', 'Infectious Disease Specialist'],
                    'mortality_risk': 'moderate'
                }
            },
            'covid19': {
                'symptoms': {
                    'cough': 0.85,
                    'fever': 0.75,
                    'shortness_of_breath': 0.72,
                    'fatigue': 0.80,
                    'headache': 0.65,
                },
                'metadata': {
                    'name': 'COVID-19',
                    'icd10': 'U07.1',
                    'urgency': 'urgent',
                    'description': 'Coronavirus disease 2019 (SARS-CoV-2 infection)',
                    'common_treatments': ['Supportive care', 'Antivirals', 'Oxygen', 'Monitoring'],
                    'specialists': ['Infectious Disease Specialist', 'Pulmonologist', 'General Physician'],
                    'mortality_risk': 'moderate'
                }
            },
            'migraine': {
                'symptoms': {
                    'headache': 0.95,
                    'nausea': 0.58,
                    'dizziness': 0.42,
                    'fatigue': 0.50,
                },
                'metadata': {
                    'name': 'Migraine',
                    'icd10': 'G43.909',
                    'urgency': 'non-urgent',
                    'description': 'Recurrent neurological condition with intense throbbing headaches',
                    'common_treatments': ['Pain relievers', 'Triptans', 'Preventive medications', 'Rest'],
                    'specialists': ['Neurologist', 'General Physician'],
                    'mortality_risk': 'low'
                }
            },
            'gastroenteritis': {
                'symptoms': {
                    'nausea': 0.85,
                    'fatigue': 0.70,
                    'fever': 0.55,
                    'headache': 0.40,
                },
                'metadata': {
                    'name': 'Gastroenteritis (Stomach Flu)',
                    'icd10': 'A09',
                    'urgency': 'moderate',
                    'description': 'Inflammation of stomach and intestines, usually infectious',
                    'common_treatments': ['Rest', 'Hydration', 'Light diet', 'Anti-nausea medication'],
                    'specialists': ['Gastroenterologist', 'General Physician'],
                    'mortality_risk': 'low'
                }
            },
            'acute_coronary_syndrome': {
                'symptoms': {
                    'chest_pain': 0.92,
                    'shortness_of_breath': 0.68,
                    'nausea': 0.55,
                    'fatigue': 0.65,
                    'dizziness': 0.45,
                },
                'metadata': {
                    'name': 'Acute Coronary Syndrome',
                    'icd10': 'I24.9',
                    'urgency': 'emergency',
                    'description': 'Life-threatening condition with sudden reduction in heart blood flow',
                    'common_treatments': ['Emergency treatment', 'Aspirin', 'Anticoagulants', 'Cardiac intervention'],
                    'specialists': ['Cardiologist', 'Emergency Medicine', 'Interventional Cardiologist'],
                    'mortality_risk': 'high'
                }
            },
            'angina_pectoris': {
                'symptoms': {
                    'chest_pain': 0.85,
                    'shortness_of_breath': 0.72,
                    'fatigue': 0.45,
                    'dizziness': 0.35,
                },
                'metadata': {
                    'name': 'Angina Pectoris',
                    'icd10': 'I20.9',
                    'urgency': 'urgent',
                    'description': 'Chest pain due to reduced blood flow to heart muscle',
                    'common_treatments': ['Nitrates', 'Beta-blockers', 'Calcium antagonists', 'Lifestyle modification'],
                    'specialists': ['Cardiologist', 'General Physician'],
                    'mortality_risk': 'moderate'
                }
            },
            'common_cold': {
                'symptoms': {
                    'cough': 0.70,
                    'fever': 0.45,
                    'fatigue': 0.55,
                    'headache': 0.50,
                },
                'metadata': {
                    'name': 'Common Cold',
                    'icd10': 'J00',
                    'urgency': 'non-urgent',
                    'description': 'Viral upper respiratory infection',
                    'common_treatments': ['Rest', 'Fluids', 'Pain relievers', 'Cough suppressants'],
                    'specialists': ['General Physician'],
                    'mortality_risk': 'low'
                }
            },
            'diabetes': {
                'symptoms': {
                    'fatigue': 0.70,
                    'dizziness': 0.45,
                    'headache': 0.40,
                },
                'metadata': {
                    'name': 'Diabetes Mellitus',
                    'icd10': 'E11.9',
                    'urgency': 'moderate',
                    'description': 'Metabolic disorder affecting blood glucose regulation',
                    'common_treatments': ['Insulin', 'Oral medications', 'Diet control', 'Exercise', 'Monitoring'],
                    'specialists': ['Endocrinologist', 'General Physician'],
                    'mortality_risk': 'moderate'
                }
            },
            'hypertension': {
                'symptoms': {
                    'headache': 0.65,
                    'dizziness': 0.55,
                    'fatigue': 0.40,
                    'chest_pain': 0.30,
                },
                'metadata': {
                    'name': 'Hypertension (High Blood Pressure)',
                    'icd10': 'I10',
                    'urgency': 'moderate',
                    'description': 'Persistently elevated blood pressure',
                    'common_treatments': ['Antihypertensive drugs', 'Lifestyle changes', 'Salt reduction', 'Exercise'],
                    'specialists': ['Cardiologist', 'General Physician'],
                    'mortality_risk': 'moderate'
                }
            },
            'anxiety_disorder': {
                'symptoms': {
                    'chest_pain': 0.50,
                    'shortness_of_breath': 0.65,
                    'dizziness': 0.55,
                    'headache': 0.45,
                    'nausea': 0.40,
                },
                'metadata': {
                    'name': 'Anxiety Disorder',
                    'icd10': 'F41.9',
                    'urgency': 'non-urgent',
                    'description': 'Excessive and persistent worry and fear',
                    'common_treatments': ['Therapy', 'Antidepressants', 'Breathing exercises', 'Relaxation'],
                    'specialists': ['Psychiatrist', 'Psychologist', 'General Physician'],
                    'mortality_risk': 'low'
                }
            }
        }
    
    def predict_diseases(self, symptom_profile: Dict, lifestyle_factors: Dict = None) -> List[Dict]:
        """
        Predict possible diseases with confidence scores
        
        Args:
            symptom_profile: Dict with symptoms and their severity (0-10)
            lifestyle_factors: Dict with lifestyle information
        
        Returns:
            List of diseases ranked by probability
        """
        predictions = []
        
        for disease_name, disease_data in self.disease_database.items():
            score = self._calculate_bayesian_score(
                symptom_profile,
                disease_data['symptoms'],
                lifestyle_factors
            )
            
            predictions.append({
                'disease': disease_name,
                'name': disease_data['metadata']['name'],
                'confidence': min(score, 99.9),  # Cap at 99.9%
                'urgency': disease_data['metadata']['urgency'],
                'description': disease_data['metadata']['description'],
                'specialists': disease_data['metadata']['specialists'],
                'treatments': disease_data['metadata']['common_treatments'],
                'icd10': disease_data['metadata']['icd10'],
                'mortality_risk': disease_data['metadata']['mortality_risk'],
                'matching_symptoms': self._get_matching_symptoms(
                    symptom_profile,
                    disease_data['symptoms']
                )
            })
        
        # Sort by confidence (descending)
        predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        return predictions[:5]  # Return top 5
    
    def _calculate_bayesian_score(self, symptom_profile: Dict, disease_symptoms: Dict, lifestyle: Dict = None) -> float:
        """Calculate Bayesian probability score"""
        if not symptom_profile:
            return 0.0
        
        score = 0.0
        weight = 0.0
        
        # Score based on matching symptoms
        for symptom, severity in symptom_profile.items():
            if symptom in disease_symptoms:
                # Weight higher severity more heavily
                symptom_score = (disease_symptoms[symptom] * (severity / 10))
                score += symptom_score
                weight += 1.0
        
        if weight == 0:
            return 0.0
        
        base_score = (score / weight) * 100
        
        # Adjust for lifestyle factors
        if lifestyle:
            lifestyle_penalty = 0.0
            
            # Apply lifestyle adjustments
            if lifestyle.get('smoker') and 'pneumonia' in self.disease_database:
                lifestyle_penalty += 5
            if lifestyle.get('alcohol_weekly', 0) > 15:
                lifestyle_penalty += 3
            if lifestyle.get('stress_level') == 'high':
                lifestyle_penalty += 2
            
            base_score -= lifestyle_penalty
        
        return max(base_score, 0.0)
    
    def _get_matching_symptoms(self, patient_symptoms: Dict, disease_symptoms: Dict) -> List[str]:
        """Get list of matching symptoms"""
        matches = []
        for symptom in patient_symptoms.keys():
            if symptom in disease_symptoms:
                matches.append(symptom)
        return matches
    
    def get_disease_details(self, disease_name: str) -> Dict:
        """Get detailed information about a disease"""
        if disease_name in self.disease_database:
            return self.disease_database[disease_name]['metadata']
        return {}
