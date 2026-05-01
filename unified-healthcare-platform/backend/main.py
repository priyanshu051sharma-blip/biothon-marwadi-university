"""
Unified Healthcare Platform - Production Backend
FastAPI server with ML models, AI agents, and GraphRAG
Enhanced with symptom questionnaire, disease prediction, doctor recommendation, and medicines
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
from datetime import datetime

from agents.orchestrator import AgentOrchestrator
from agents.symptom_questionnaire_agent import SymptomQuestionnaireAgent
from agents.disease_prediction_advanced import AdvancedDiseasePredictionAgent
from agents.doctor_recommendation_agent import DoctorRecommendationAgent
from agents.medicine_blood_bank_agent import MedicineBloodBankAgent
from services.multilingual_service import MultilingualManager
from services.text_to_speech_service import TextToSpeechService
try:
    from ml_models.radiology_model import RadiologyModel
    from ml_models.symptom_classifier import SymptomClassifier
except:
    RadiologyModel = None
    SymptomClassifier = None
try:
    from database.db_manager import DatabaseManager
except:
    DatabaseManager = None
try:
    from services.auth_service import AuthService
except:
    AuthService = None
try:
    from services.notification_service import NotificationService
except:
    NotificationService = None

app = FastAPI(
    title="HealthAI Pro API",
    version="2.0.0",
    description="Unified Healthcare Intelligence Platform"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
orchestrator = AgentOrchestrator()
symptom_questionnaire = SymptomQuestionnaireAgent()
disease_predictor = AdvancedDiseasePredictionAgent()
doctor_agent = DoctorRecommendationAgent()
medicine_agent = MedicineBloodBankAgent()
multilingual_manager = MultilingualManager()
tts_service = TextToSpeechService()

# Optional services (if available)
if RadiologyModel:
    radiology_model = RadiologyModel()
else:
    radiology_model = None

if SymptomClassifier:
    symptom_classifier = SymptomClassifier()
else:
    symptom_classifier = None

if DatabaseManager:
    db = DatabaseManager()
else:
    db = None

if AuthService:
    auth_service = AuthService()
else:
    auth_service = None

if NotificationService:
    notification_service = NotificationService()
else:
    notification_service = None

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class SymptomAnalysisRequest(BaseModel):
    patient_id: str
    symptoms: str
    patient_context: Optional[Dict] = None

class RadiologyAnalysisRequest(BaseModel):
    patient_id: str
    scan_type: str
    metadata: Optional[Dict] = None

# New models for enhanced features
class SymptomQuestionnaireRequest(BaseModel):
    patient_id: str
    symptom: str
    language: str = 'en'

class SymptomResponseRequest(BaseModel):
    patient_id: str
    symptom: str
    responses: Dict
    language: str = 'en'

class DiseasePredictionRequest(BaseModel):
    symptom_profile: Dict
    lifestyle_factors: Optional[Dict] = None

class DoctorSearchRequest(BaseModel):
    disease: str
    location: Optional[str] = None

class AppointmentBookingRequest(BaseModel):
    patient_id: str
    doctor_id: str
    slot_id: str
    reason: str

class MedicineSearchRequest(BaseModel):
    medicine_name: str
    location: Optional[str] = None

class BloodSearchRequest(BaseModel):
    blood_type: str
    location: Optional[str] = None

class TTSRequest(BaseModel):
    text: str
    language: str = 'en'
    speech_rate: str = 'normal'

@app.on_event("startup")
async def startup_event():
    """Initialize ML models and connections"""
    if radiology_model:
        try:
            await radiology_model.load_model()
        except:
            pass
    if symptom_classifier:
        try:
            await symptom_classifier.load_model()
        except:
            pass
    if db:
        try:
            await db.connect()
        except:
            pass
    print("✅ All available services initialized")

@app.get("/")
def root():
    return {
        "service": "HealthAI Pro",
        "version": "2.0.0",
        "status": "operational",
        "features": [
            "AI Radiology Analysis",
            "Symptom Intelligence with Questionnaire",
            "Advanced Disease Prediction",
            "Doctor Recommendation & Appointment Booking",
            "Medicine & Blood Bank Availability",
            "Multilingual Support (10+ languages)",
            "Text-to-Speech for Accessibility",
            "GraphRAG Decision Support",
            "Care Coordination",
            "Real-time Analytics"
        ],
        "supported_languages": multilingual_manager.get_supported_languages(),
        "endpoints": {
            "symptoms": "/api/symptoms",
            "disease_prediction": "/api/diseases/predict",
            "doctors": "/api/doctors/search",
            "appointments": "/api/appointments",
            "medicines": "/api/medicines/search",
            "blood": "/api/blood/search",
            "tts": "/api/tts/convert",
            "translations": "/api/translations"
        }
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Authenticate user"""
    user = await auth_service.authenticate(request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth_service.generate_token(user)
    return {
        "token": token,
        "user": user,
        "expires_in": 86400
    }

@app.post("/api/radiology/analyze")
async def analyze_radiology(
    file: UploadFile = File(...),
    patient_id: str = None
):
    """Analyze radiology image with ML model"""
    try:
        # Read image
        image_data = await file.read()
        
        # Run ML analysis
        result = await radiology_model.predict(image_data)
        
        # Generate heatmap
        heatmap = await radiology_model.generate_heatmap(image_data, result)
        
        # Save to database
        report_id = await db.save_radiology_report({
            'patient_id': patient_id,
            'scan_type': file.content_type,
            'findings': result['findings'],
            'diagnosis': result['diagnosis'],
            'confidence': result['confidence'],
            'heatmap_url': heatmap,
            'timestamp': datetime.now()
        })
        
        # Send notification
        await notification_service.notify_doctor(patient_id, result)
        
        return {
            'report_id': report_id,
            **result,
            'heatmap_url': heatmap
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/symptoms/analyze")
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """Analyze symptoms with multi-agent AI system"""
    try:
        # Run orchestrated analysis
        result = await orchestrator.analyze_symptoms(
            symptoms=request.symptoms,
            patient_id=request.patient_id,
            context=request.patient_context
        )
        
        # Save analysis
        analysis_id = await db.save_symptom_analysis({
            'patient_id': request.patient_id,
            'symptoms': request.symptoms,
            'predictions': result['predictions'],
            'risk_flags': result['risk_flags'],
            'recommended_tests': result['suggested_tests'],
            'reasoning_path': result['reasoning'],
            'timestamp': datetime.now()
        })
        
        return {
            'analysis_id': analysis_id,
            **result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get patient details with digital twin"""
    patient = await db.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get patient timeline
    timeline = await db.get_patient_timeline(patient_id)
    
    return {
        **patient,
        'timeline': timeline
    }

@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics():
    """Get dashboard analytics"""
    stats = await db.get_dashboard_stats()
    return stats

@app.get("/api/analytics/performance")
async def get_ai_performance():
    """Get AI model performance metrics"""
    metrics = {
        'radiology_model': await radiology_model.get_metrics(),
        'symptom_classifier': await symptom_classifier.get_metrics(),
        'graphrag_performance': await orchestrator.get_performance_metrics()
    }
    return metrics

@app.websocket("/ws/notifications")
async def websocket_notifications(websocket):
    """WebSocket for real-time notifications"""
    await notification_service.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except:
        await notification_service.disconnect(websocket)


# ============================================================
# NEW ENDPOINTS FOR ADVANCED HEALTHCARE FEATURES
# ============================================================

@app.post("/api/symptoms/questionnaire")
async def get_symptom_questions(request: SymptomQuestionnaireRequest):
    """Get detailed questions for a symptom"""
    questions = symptom_questionnaire.get_symptom_questions(request.symptom)
    
    # Translate if needed
    if request.language != 'en':
        translated_questions = {
            'main': multilingual_manager.get_translation(f'symptom.question.main_{request.symptom}', request.language),
            'followup': [multilingual_manager.get_translation(f'symptom.question.{i}', request.language) for i in range(len(questions['followup']))]
        }
        return translated_questions
    
    return questions

@app.post("/api/symptoms/compile-profile")
async def compile_symptom_profile(request: SymptomResponseRequest):
    """Compile comprehensive patient profile from symptom responses"""
    profile = symptom_questionnaire.compile_patient_profile(request.responses)
    
    return {
        'patient_id': request.patient_id,
        'profile': profile,
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/diseases/predict")
async def predict_diseases(request: DiseasePredictionRequest):
    """Predict diseases based on symptom profile"""
    predictions = disease_predictor.predict_diseases(
        request.symptom_profile,
        request.lifestyle_factors
    )
    
    return {
        'predictions': predictions,
        'total_matches': len(predictions),
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/doctors/search")
async def search_doctors(request: DoctorSearchRequest):
    """Search and recommend doctors for a disease"""
    doctors = doctor_agent.recommend_doctors(request.disease, request.location)
    
    return {
        'disease': request.disease,
        'recommended_doctors': doctors,
        'total_found': len(doctors),
        'timestamp': datetime.now().isoformat()
    }

@app.get("/api/doctors/{doctor_id}/availability")
async def get_doctor_availability(doctor_id: str):
    """Get available appointment slots for a doctor"""
    slots = doctor_agent.get_available_slots(doctor_id)
    
    return {
        'doctor_id': doctor_id,
        'available_slots': slots,
        'total_available': sum(1 for s in slots if s['available']),
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/appointments/book")
async def book_appointment(request: AppointmentBookingRequest):
    """Book an appointment with a doctor"""
    result = doctor_agent.book_appointment({
        'patient_id': request.patient_id,
        'doctor_id': request.doctor_id,
        'slot_id': request.slot_id,
        'reason': request.reason
    })
    
    return result

@app.post("/api/appointments/{appointment_id}/cancel")
async def cancel_appointment(appointment_id: str):
    """Cancel an appointment"""
    result = doctor_agent.cancel_appointment(appointment_id)
    return result

@app.post("/api/medicines/search")
async def search_medicines(request: MedicineSearchRequest):
    """Search for medicines and their availability"""
    medicines = medicine_agent.find_medicines(request.medicine_name, request.location)
    
    return {
        'search_query': request.medicine_name,
        'results': medicines,
        'total_found': len(medicines),
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/medicines/for-disease")
async def get_medicines_for_disease(disease: str):
    """Get recommended medicines for a disease"""
    medicines = medicine_agent.search_medication_for_disease(disease)
    
    return {
        'disease': disease,
        'recommended_medicines': medicines,
        'total_found': len(medicines),
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/blood/search")
async def search_blood(request: BloodSearchRequest):
    """Search blood bank for blood types"""
    banks = medicine_agent.find_blood(request.blood_type, request.location)
    
    return {
        'blood_type': request.blood_type,
        'available_banks': banks,
        'total_found': len(banks),
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/blood/reserve")
async def reserve_blood(patient_id: str, blood_bank_id: str, blood_type: str, units: int):
    """Reserve blood units from a blood bank"""
    result = medicine_agent.reserve_blood(
        blood_bank_id,
        blood_type,
        units,
        {'patient_id': patient_id}
    )
    
    return result

@app.post("/api/tts/convert")
async def convert_text_to_speech(request: TTSRequest):
    """Convert text to speech"""
    result = tts_service.convert_text_to_speech(request.text, request.language, request.speech_rate)
    return result

@app.get("/api/tts/languages")
async def get_tts_languages():
    """Get supported TTS languages"""
    languages = tts_service.get_supported_languages()
    return {
        'supported_languages': languages,
        'total_languages': len(languages)
    }

@app.post("/api/tts/test")
async def test_tts_voice(language: str = 'en'):
    """Test text-to-speech for a language"""
    result = tts_service.test_voice(language)
    return result

@app.get("/api/translations/supported-languages")
async def get_supported_languages():
    """Get list of supported languages"""
    languages = multilingual_manager.get_supported_languages()
    return {
        'supported_languages': languages,
        'total_languages': len(languages)
    }

@app.get("/api/translations/{language}")
async def get_translations(language: str):
    """Get all translations for a language"""
    if language not in multilingual_manager.get_supported_languages():
        raise HTTPException(status_code=400, detail=f"Language {language} not supported")
    
    translations = {}
    # Get all available keys
    for key in multilingual_manager.translations.get('en', {}).keys():
        translations[key] = multilingual_manager.get_translation(key, language)
    
    return {
        'language': language,
        'translations': translations,
        'total_keys': len(translations)
    }

@app.post("/api/patient/comprehensive-assessment")
async def comprehensive_assessment(
    patient_id: str,
    symptom_responses: Dict,
    lifestyle_factors: Dict,
    language: str = 'en'
):
    """Comprehensive health assessment combining all agents"""
    # Compile symptom profile
    profile = symptom_questionnaire.compile_patient_profile(symptom_responses)
    
    # Predict diseases
    symptom_profile = symptom_responses.get('symptom_responses', {})
    disease_predictions = disease_predictor.predict_diseases(symptom_profile, lifestyle_factors)
    
    # Get recommended doctors and medicines
    assessment = {
        'patient_id': patient_id,
        'symptom_profile': profile,
        'disease_predictions': disease_predictions[:3],  # Top 3
        'recommendations': [],
        'timestamp': datetime.now().isoformat()
    }
    
    # Get doctors and medicines for top prediction
    if disease_predictions:
        top_disease = disease_predictions[0]['disease']
        recommended_doctors = doctor_agent.recommend_doctors(top_disease)
        recommended_medicines = medicine_agent.search_medication_for_disease(top_disease)
        
        assessment['recommendations'] = {
            'doctors': recommended_doctors[:3],
            'medicines': recommended_medicines,
            'specialists': disease_predictions[0]['specialists']
        }
    
    return assessment

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
