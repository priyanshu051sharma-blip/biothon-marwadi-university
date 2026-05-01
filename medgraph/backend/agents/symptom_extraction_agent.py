"""
Symptom Extraction Agent
Extracts clinical symptom entities from natural language input
"""

import re
from typing import List, Dict

class SymptomExtractionAgent:
    def __init__(self):
        self.symptom_patterns = {
            'chest_pain': ['chest pain', 'chest tightness', 'chest pressure', 'angina'],
            'shortness_of_breath': ['shortness of breath', 'dyspnea', 'breathing difficulty', 'sob'],
            'fatigue': ['fatigue', 'tired', 'exhausted', 'weakness'],
            'headache': ['headache', 'head pain', 'migraine'],
            'fever': ['fever', 'high temperature', 'pyrexia'],
            'cough': ['cough', 'coughing'],
            'nausea': ['nausea', 'nauseous', 'sick to stomach'],
            'dizziness': ['dizziness', 'dizzy', 'lightheaded', 'vertigo']
        }
        
        self.severity_keywords = {
            'severe': ['severe', 'intense', 'extreme', 'unbearable'],
            'moderate': ['moderate', 'noticeable', 'significant'],
            'mild': ['mild', 'slight', 'minor', 'little']
        }
        
        self.duration_patterns = [
            r'(\d+)\s*(day|days|week|weeks|month|months|hour|hours)',
            r'for\s+(\d+)\s*(day|days|week|weeks)',
            r'past\s+(\d+)\s*(day|days|week|weeks)'
        ]
    
    def extract(self, text: str) -> Dict:
        """Extract symptoms from natural language text"""
        text_lower = text.lower()
        
        extracted_symptoms = []
        
        # Extract symptoms
        for symptom_key, patterns in self.symptom_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    symptom_data = {
                        'symptom': symptom_key,
                        'original_text': pattern,
                        'severity': self._extract_severity(text_lower),
                        'duration': self._extract_duration(text_lower)
                    }
                    extracted_symptoms.append(symptom_data)
                    break
        
        return {
            'symptoms': extracted_symptoms,
            'raw_text': text,
            'confidence': 0.85 if extracted_symptoms else 0.0
        }
    
    def _extract_severity(self, text: str) -> str:
        """Extract severity level from text"""
        for severity, keywords in self.severity_keywords.items():
            if any(keyword in text for keyword in keywords):
                return severity
        return 'moderate'  # default
    
    def _extract_duration(self, text: str) -> str:
        """Extract duration from text"""
        for pattern in self.duration_patterns:
            match = re.search(pattern, text)
            if match:
                return f"{match.group(1)} {match.group(2)}"
        return 'unknown'
    
    def normalize_to_snomed(self, symptom: str) -> str:
        """Map symptom to SNOMED CT code (simplified)"""
        snomed_mapping = {
            'chest_pain': 'SNOMED:29857009',
            'shortness_of_breath': 'SNOMED:267036007',
            'fatigue': 'SNOMED:84229001',
            'headache': 'SNOMED:25064002',
            'fever': 'SNOMED:386661006',
            'cough': 'SNOMED:49727002',
            'nausea': 'SNOMED:422587007',
            'dizziness': 'SNOMED:404640003'
        }
        return snomed_mapping.get(symptom, 'SNOMED:unknown')
