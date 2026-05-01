"""
Disease Prediction Agent
Ranks disease candidates using Bayesian scoring
"""

from typing import List, Dict
import math

class DiseasePredictionAgent:
    def __init__(self):
        # Simplified disease-symptom probability matrix
        self.disease_symptom_probs = {
            'angina_pectoris': {
                'chest_pain': 0.85,
                'shortness_of_breath': 0.72,
                'fatigue': 0.45
            },
            'acute_coronary_syndrome': {
                'chest_pain': 0.92,
                'shortness_of_breath': 0.68,
                'nausea': 0.55
            },
            'gerd': {
                'chest_pain': 0.45,
                'nausea': 0.62
            },
            'pneumonia': {
                'cough': 0.88,
                'fever': 0.82,
                'shortness_of_breath': 0.65
            },
            'migraine': {
                'headache': 0.95,
                'nausea': 0.58,
                'dizziness': 0.42
            }
        }
        
        self.disease_metadata = {
            'angina_pectoris': {
                'name': 'Angina Pectoris',
                'icd10': 'I20.9',
                'urgency': 'urgent',
                'description': 'Chest pain due to reduced blood flow to heart muscle'
            },
            'acute_coronary_syndrome': {
                'name': 'Acute Coronary Syndrome',
                'icd10': 'I24.9',
                'urgency': 'emergency',
                'description': 'Sudden reduction in blood flow to the heart'
            },
            'gerd': {
                'name': 'GERD',
                'icd10': 'K21.9',
                'urgency': 'routine',
                'description': 'Gastroesophageal reflux disease'
            },
            'pneumonia': {
                'name': 'Pneumonia',
                'icd10': 'J18.9',
                'urgency': 'urgent',
                'description': 'Lung infection causing inflammation'
            },
            'migraine': {
                'name': 'Migraine',
                'icd10': 'G43.9',
                'urgency': 'monitor',
                'description': 'Severe recurring headache'
            }
        }
    
    def predict(self, symptoms: List[str], patient_context: Dict = None) -> List[Dict]:
        """Predict diseases based on symptoms and patient context"""
        disease_scores = {}
        
        # Calculate base probability for each disease
        for disease, symptom_probs in self.disease_symptom_probs.items():
            score = 0.0
            matching_symptoms = 0
            
            for symptom in symptoms:
                if symptom in symptom_probs:
                    score += symptom_probs[symptom]
                    matching_symptoms += 1
            
            if matching_symptoms > 0:
                # Normalize by number of symptoms
                base_score = score / len(symptoms)
                
                # Apply patient context modifiers
                if patient_context:
                    base_score = self._apply_context_modifiers(
                        disease, base_score, patient_context
                    )
                
                disease_scores[disease] = base_score
        
        # Rank and format predictions
        predictions = []
        for disease, score in sorted(disease_scores.items(), key=lambda x: x[1], reverse=True):
            metadata = self.disease_metadata[disease]
            probability = min(int(score * 100), 99)
            
            predictions.append({
                'disease': metadata['name'],
                'icd10': metadata['icd10'],
                'probability': probability,
                'confidence': [max(probability - 8, 0), min(probability + 8, 100)],
                'urgency': metadata['urgency'],
                'description': metadata['description']
            })
        
        return predictions[:5]  # Top 5 predictions
    
    def _apply_context_modifiers(self, disease: str, base_score: float, context: Dict) -> float:
        """Apply patient-specific modifiers to disease probability"""
        modified_score = base_score
        
        # Age modifier
        age = context.get('age', 0)
        if disease in ['angina_pectoris', 'acute_coronary_syndrome'] and age > 45:
            modified_score += 0.15
        
        # Comorbidity modifier
        conditions = context.get('conditions', [])
        if disease in ['angina_pectoris', 'acute_coronary_syndrome']:
            if 'hypertension' in [c.lower() for c in conditions]:
                modified_score += 0.12
            if 'diabetes' in [c.lower() for c in conditions]:
                modified_score += 0.10
        
        return min(modified_score, 0.99)
