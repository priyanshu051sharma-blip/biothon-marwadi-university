"""
Advanced Symptom Questionnaire Agent
Conducts comprehensive symptom analysis like a doctor
"""

from typing import Dict, List, Optional
from datetime import datetime
import json

class SymptomQuestionnaireAgent:
    """Asks detailed questions about symptoms in conversational manner"""
    
    def __init__(self):
        self.symptom_questions = {
            'chest_pain': {
                'main': 'You mentioned chest pain. Let me ask a few details to better understand.',
                'followup': [
                    'How long have you been experiencing this chest pain? (duration)',
                    'On a scale of 1-10, how severe is the pain?',
                    'Is it constant or does it come and go?',
                    'Does it spread to your arm, neck, or shoulder?',
                    'Do you feel shortness of breath along with it?',
                    'Does it get worse when you move or breathe deeply?',
                    'Any recent stress or anxiety?',
                    'Did you have any physical exertion before this pain started?',
                ]
            },
            'headache': {
                'main': 'Headache detected. Let me gather more information.',
                'followup': [
                    'How long have you had this headache? (duration)',
                    'Is it on one side or both sides of your head?',
                    'On a scale of 1-10, what\'s the intensity?',
                    'Is it a throbbing, sharp, or dull pain?',
                    'Are you sensitive to light or sound?',
                    'Any nausea or vomiting?',
                    'Have you had recent head injury or trauma?',
                    'How much water did you drink today?',
                    'How well did you sleep last night?',
                    'Any recent stress or tension?',
                ]
            },
            'fever': {
                'main': 'Fever noted. Let me get more details.',
                'followup': [
                    'For how long have you had fever? (duration)',
                    'What\'s your current body temperature?',
                    'Has the fever been constant or does it come and go?',
                    'Are you taking any fever-reducing medication?',
                    'Do you have body aches or joint pain?',
                    'Any cough or sore throat?',
                    'Any recent exposure to sick people?',
                    'How much water and fluids have you consumed?',
                    'Any recent travel or new environment?',
                ]
            },
            'cough': {
                'main': 'Cough observed. Let me understand it better.',
                'followup': [
                    'How long have you been coughing? (duration)',
                    'Is it a dry cough or do you cough up mucus/phlegm?',
                    'If you cough up mucus, what color is it?',
                    'Is it worse at night or during day?',
                    'Does it get worse with cold air or exercise?',
                    'Any chest pain when you cough?',
                    'Do you have shortness of breath?',
                    'Any recent cold or flu?',
                    'Have you been around people with cough?',
                    'Are you a smoker?',
                ]
            },
            'fatigue': {
                'main': 'You\'re experiencing fatigue. Let me understand this better.',
                'followup': [
                    'For how long have you felt this fatigue? (duration)',
                    'Is it constant or does it come and go?',
                    'How is your sleep quality? How many hours do you sleep?',
                    'Do you wake up feeling rested?',
                    'Any difficulty concentrating or memory issues?',
                    'Have you had any recent illness or infection?',
                    'Any recent major stress or life changes?',
                    'What\'s your diet like? Are you eating enough?',
                    'How much water do you drink daily?',
                    'Any unintended weight loss or gain?',
                ]
            },
            'nausea': {
                'main': 'Nausea reported. Let me gather context.',
                'followup': [
                    'How long have you been feeling nauseous? (duration)',
                    'Have you vomited? If yes, how many times?',
                    'What color is the vomit? Any blood?',
                    'When did you last eat? What did you eat?',
                    'Any abdominal pain or cramping?',
                    'Have you had diarrhea or constipation?',
                    'Any recent medication change?',
                    'Are you pregnant or could you be pregnant?',
                    'Any recent food that seemed off?',
                    'Do you have fever along with this?',
                ]
            },
            'dizziness': {
                'main': 'Dizziness reported. Let me ask some important questions.',
                'followup': [
                    'How long have you been dizzy? (duration)',
                    'Does the room spin (vertigo) or do you feel lightheaded?',
                    'On a scale of 1-10, how severe?',
                    'Does it get worse with head movement?',
                    'Does it get worse when standing up?',
                    'Any loss of balance or falling?',
                    'Any hearing problems or ear ringing?',
                    'Any recent head injury?',
                    'Are you on any new medications?',
                    'How is your blood pressure usually?',
                ]
            }
        }
        
        self.lifestyle_questions = [
            'How many hours do you sleep per night?',
            'How would you rate your sleep quality? (good/fair/poor)',
            'What\'s your daily diet like? (balanced/mostly junk/vegetarian/etc)',
            'How much water do you drink per day?',
            'Do you exercise regularly? How often?',
            'Do you smoke or use tobacco products?',
            'How much alcohol do you consume per week?',
            'Are you under stress? What\'s causing it?',
            'Do you have any chronic diseases? (diabetes, hypertension, etc)',
            'Are you currently on any medications?'
        ]
        
        self.recent_events = [
            'Any recent travel? Where?',
            'Have you been around anyone sick recently?',
            'Any recent accidents or injuries?',
            'Any recent medication changes?',
            'Have you eaten anything unusual recently?',
            'Any recent vaccinations?',
            'Any recent surgeries or medical procedures?'
        ]
    
    def get_symptom_questions(self, symptom: str) -> Dict:
        """Get specific questions for a symptom"""
        if symptom in self.symptom_questions:
            return self.symptom_questions[symptom]
        return {
            'main': f'You mentioned {symptom}. Can you describe it in more detail?',
            'followup': [
                'How long have you had this symptom?',
                'How severe is it on a scale of 1-10?',
                'Is it constant or intermittent?',
                'Have you experienced this before?',
                'Any recent changes in this symptom?'
            ]
        }
    
    def get_lifestyle_questions(self) -> List[str]:
        """Get lifestyle assessment questions"""
        return self.lifestyle_questions
    
    def get_recent_event_questions(self) -> List[str]:
        """Get questions about recent events"""
        return self.recent_events
    
    def compile_patient_profile(self, responses: Dict) -> Dict:
        """Compile comprehensive patient profile from responses"""
        profile = {
            'timestamp': datetime.now().isoformat(),
            'symptoms': {},
            'lifestyle': {},
            'recent_events': {},
            'risk_factors': [],
            'health_summary': ''
        }
        
        # Process symptom responses
        if 'symptom_responses' in responses:
            for symptom, answers in responses['symptom_responses'].items():
                profile['symptoms'][symptom] = {
                    'severity': answers.get('severity'),
                    'duration': answers.get('duration'),
                    'characteristics': answers.get('characteristics', [])
                }
        
        # Process lifestyle
        if 'lifestyle_responses' in responses:
            profile['lifestyle'] = responses['lifestyle_responses']
            
            # Identify lifestyle risk factors
            if responses['lifestyle_responses'].get('sleep_hours', 0) < 6:
                profile['risk_factors'].append('Poor sleep (<6 hours)')
            if responses['lifestyle_responses'].get('water_intake', 0) < 2:
                profile['risk_factors'].append('Insufficient water intake')
            if responses['lifestyle_responses'].get('exercise_frequency', 0) == 0:
                profile['risk_factors'].append('Sedentary lifestyle')
            if responses['lifestyle_responses'].get('smoker'):
                profile['risk_factors'].append('Smoking')
            if responses['lifestyle_responses'].get('alcohol_weekly', 0) > 10:
                profile['risk_factors'].append('High alcohol consumption')
            if responses['lifestyle_responses'].get('stress_level') == 'high':
                profile['risk_factors'].append('High stress')
        
        # Process recent events
        if 'recent_events' in responses:
            profile['recent_events'] = responses['recent_events']
        
        profile['health_summary'] = self._generate_summary(profile)
        return profile
    
    def _generate_summary(self, profile: Dict) -> str:
        """Generate human-readable health summary"""
        summary = []
        
        symptoms = profile['symptoms']
        if symptoms:
            symptom_list = ', '.join(symptoms.keys())
            summary.append(f"Patient reports: {symptom_list}")
        
        risk_factors = profile['risk_factors']
        if risk_factors:
            summary.append(f"Risk factors identified: {', '.join(risk_factors)}")
        
        return ' | '.join(summary)
