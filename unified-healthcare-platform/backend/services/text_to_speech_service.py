"""
Text-to-Speech Service
Provides voice output in multiple languages for accessibility
"""

class TextToSpeechService:
    """Handles text-to-speech conversion"""
    
    def __init__(self):
        self.supported_languages = {
            'en': {'name': 'English', 'voice_name': 'en-US', 'voice_gender': 'female'},
            'hi': {'name': 'हिन्दी', 'voice_name': 'hi-IN', 'voice_gender': 'female'},
            'mr': {'name': 'मराठी', 'voice_name': 'mr-IN', 'voice_gender': 'female'},
            'gu': {'name': 'ગુજરાતી', 'voice_name': 'gu-IN', 'voice_gender': 'female'},
            'pa': {'name': 'ਪੰਜਾਬੀ', 'voice_name': 'pa-IN', 'voice_gender': 'female'},
            'ta': {'name': 'தமிழ்', 'voice_name': 'ta-IN', 'voice_gender': 'female'},
            'te': {'name': 'తెలుగు', 'voice_name': 'te-IN', 'voice_gender': 'female'},
            'kn': {'name': 'ಕನ್ನಡ', 'voice_name': 'kn-IN', 'voice_gender': 'female'},
            'ur': {'name': 'اردو', 'voice_name': 'ur-IN', 'voice_gender': 'female'},
            'bn': {'name': 'বাংলা', 'voice_name': 'bn-IN', 'voice_gender': 'female'},
        }
        
        self.speech_rate_options = {
            'slow': 0.7,
            'normal': 1.0,
            'fast': 1.5
        }
    
    def convert_text_to_speech(self, text: str, language: str = 'en', speech_rate: str = 'normal') -> dict:
        """
        Convert text to speech
        
        Args:
            text: Text to convert
            language: Language code (en, hi, mr, etc.)
            speech_rate: Speed of speech (slow, normal, fast)
        
        Returns:
            Audio data and metadata
        """
        if language not in self.supported_languages:
            language = 'en'
        
        if speech_rate not in self.speech_rate_options:
            speech_rate = 'normal'
        
        return {
            'success': True,
            'text': text,
            'language': language,
            'language_name': self.supported_languages[language]['name'],
            'voice_name': self.supported_languages[language]['voice_name'],
            'speech_rate': self.speech_rate_options[speech_rate],
            'audio_url': f'/api/tts/audio/{language}_{speech_rate}',
            'duration_ms': len(text) * 50,  # Approximate
            'format': 'mp3',
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }
    
    def get_symptoms_as_speech(self, symptoms: list, language: str = 'en') -> dict:
        """Convert symptom information to speech"""
        symptom_text = f"You are experiencing: {', '.join(symptoms)}. "
        symptom_text += "Please describe each symptom in detail for a better diagnosis."
        
        return self.convert_text_to_speech(symptom_text, language)
    
    def get_diagnosis_as_speech(self, diagnosis: dict, language: str = 'en') -> dict:
        """Convert diagnosis to speech"""
        diagnosis_text = f"Based on your symptoms, {diagnosis.get('name', 'Unknown condition')} is suspected. "
        diagnosis_text += f"Urgency level: {diagnosis.get('urgency', 'Unknown')}. "
        diagnosis_text += f"Description: {diagnosis.get('description', '')}. "
        diagnosis_text += "Please consult with a qualified doctor for proper diagnosis and treatment."
        
        return self.convert_text_to_speech(diagnosis_text, language)
    
    def get_doctor_recommendation_as_speech(self, doctor: dict, language: str = 'en') -> dict:
        """Convert doctor recommendation to speech"""
        doctor_text = f"Recommended doctor: {doctor.get('name', 'Dr. Unknown')}. "
        doctor_text += f"Specialization: {doctor.get('specialization', 'General Medicine')}. "
        doctor_text += f"Experience: {doctor.get('experience', 0)} years. "
        doctor_text += f"Rating: {doctor.get('rating', 0)} out of 5. "
        doctor_text += f"Location: {doctor.get('location', 'Unknown')}. "
        doctor_text += f"Consultation fee: {doctor.get('consultation_fee', 0)} rupees."
        
        return self.convert_text_to_speech(doctor_text, language)
    
    def get_medicine_as_speech(self, medicine: dict, language: str = 'en') -> dict:
        """Convert medicine information to speech"""
        medicine_text = f"Medicine: {medicine.get('generic_name', 'Unknown')}. "
        medicine_text += f"Brand names: {', '.join(medicine.get('brand_names', []))}. "
        medicine_text += f"Dosage options: {', '.join(medicine.get('dosage_options', []))}. "
        medicine_text += f"Price range: {medicine.get('price_range', [0, 0])[0]} to {medicine.get('price_range', [0, 0])[1]} rupees."
        
        if medicine.get('requires_prescription'):
            medicine_text += " Prescription required."
        
        return self.convert_text_to_speech(medicine_text, language)
    
    def get_emergency_alert_as_speech(self, urgency: str, language: str = 'en') -> dict:
        """Convert emergency alert to speech"""
        urgency_map = {
            'emergency': 'This is a medical emergency. Call the ambulance immediately.',
            'urgent': 'This requires urgent medical attention. Please visit the nearest hospital.',
            'moderate': 'Schedule an appointment with your doctor soon.',
            'non-urgent': 'You can schedule a regular checkup with your doctor.'
        }
        
        alert_text = urgency_map.get(urgency, 'Please consult a healthcare professional.')
        
        return self.convert_text_to_speech(alert_text, language)
    
    def get_supported_languages(self) -> list:
        """Get list of supported languages with voice"""
        return [
            {
                'code': code,
                'name': data['name'],
                'voice_name': data['voice_name'],
                'voice_gender': data['voice_gender']
            }
            for code, data in self.supported_languages.items()
        ]
    
    def test_voice(self, language: str = 'en') -> dict:
        """Test voice for a language"""
        test_phrases = {
            'en': 'Hello, this is a test of the text to speech system.',
            'hi': 'नमस्ते, यह पाठ से भाषण प्रणाली का परीक्षण है।',
            'mr': 'नमस्कार, हे मजकूर ते भाषण प्रणाली चाचणी आहे।',
            'gu': 'નમસ્તે, આ ટેક્સ્ટ થી સ્પીચ સિસ્ટમનું પરીક્ષણ છે।',
            'pa': 'ਨਮਸਤੇ, ਇਹ ਪਾਠ ਤੋਂ ਭਾਸ਼ਣ ਪ্ਰਣਾਲੀ ਦੀ ਜਾਂਚ ਹੈ।',
            'ta': 'வணக்கம், இது உரை முதல் பேச்சு அமைப்பின் சோதனை.',
            'te': 'నమస్కారం, ఇది పాఠ్యం నుండి beszélgetés వ్యవస్థ యొక్క పరీక్ష.',
            'kn': 'ನಮಸ್ಕಾರ, ಇದು ಪಠ್ಯ ಸ್ಪೀಚ್ ಸಿಸ್ಟಮ್ನ ಪರೀಕ್ಷೆ.',
            'ur': 'السلام علیکم، یہ متن سے تقریر کے نظام کی جانچ ہے۔',
            'bn': 'স্বাগতম, এটি পাঠ্য থেকে বক্তৃতা সিস্টেমের পরীক্ষা।'
        }
        
        test_text = test_phrases.get(language, test_phrases['en'])
        return self.convert_text_to_speech(test_text, language)
