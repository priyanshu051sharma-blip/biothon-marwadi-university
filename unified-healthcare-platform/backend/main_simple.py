"""
Simplified Healthcare Platform Backend
FastAPI server with mock data for demo
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import random

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

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class SymptomAnalysisRequest(BaseModel):
    symptoms: str
    patient_id: Optional[str] = None

class RadiologyAnalysisRequest(BaseModel):
    patient_id: Optional[str] = None
    language: str = "english"

@app.get("/")
def root():
    return {
        "service": "HealthAI Pro",
        "version": "2.0.0",
        "status": "operational",
        "features": [
            "AI Radiology Analysis",
            "Symptom Intelligence",
            "Disease Prediction",
            "Doctor Recommendation",
            "Hospital Resources",
            "Patient Management",
            "Analytics Dashboard"
        ]
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Authenticate user"""
    return {
        "token": "demo_token_12345",
        "user": {
            "id": "U001",
            "name": "Dr. Demo User",
            "email": request.email,
            "role": "doctor"
        },
        "expires_in": 86400
    }

@app.post("/api/symptoms/analyze")
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """Analyze symptoms with AI"""
    diseases = [
        "Respiratory Infection",
        "Influenza",
        "Common Cold",
        "Pneumonia",
        "Bronchitis"
    ]
    
    return {
        "analysis_id": f"A{random.randint(1000, 9999)}",
        "diagnosis": random.choice(diseases),
        "confidence": round(random.uniform(0.80, 0.95), 3),
        "severity": random.choice(["mild", "moderate", "severe"]),
        "recommendations": [
            "Rest and stay hydrated",
            "Monitor temperature regularly",
            "Consult a doctor if symptoms worsen"
        ],
        "suggested_doctors": [
            {
                "id": "D001",
                "name": "Dr. Sarah Johnson",
                "specialty": "Pulmonologist",
                "rating": 4.9,
                "availability": "Available Today"
            },
            {
                "id": "D002",
                "name": "Dr. Rajesh Kumar",
                "specialty": "General Physician",
                "rating": 4.8,
                "availability": "Available Tomorrow"
            }
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/radiology/analyze")
async def analyze_radiology(file: UploadFile = File(...), language: str = "english"):
    """Analyze radiology image"""
    findings = [
        "Bilateral infiltrates detected in lower lobes",
        "Increased opacity in right middle lobe",
        "No pleural effusion observed",
        "Heart size within normal limits"
    ]
    
    diseases = ["Pneumonia", "Tuberculosis", "Normal", "Bronchitis"]
    
    return {
        "report_id": f"R{random.randint(1000, 9999)}",
        "diagnosis": random.choice(diseases),
        "confidence": round(random.uniform(0.85, 0.98), 3),
        "findings": findings,
        "severity": random.choice(["mild", "moderate", "severe"]),
        "recommendation": "Immediate consultation with pulmonologist recommended",
        "language": language,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/patients")
async def get_patients():
    """Get all patients"""
    return {
        "patients": [
            {
                "id": "P001",
                "name": "John Anderson",
                "age": 45,
                "gender": "Male",
                "status": "active"
            },
            {
                "id": "P002",
                "name": "Sarah Miller",
                "age": 32,
                "gender": "Female",
                "status": "active"
            }
        ],
        "total": 2
    }

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get patient details"""
    return {
        "id": patient_id,
        "name": "John Anderson",
        "age": 45,
        "gender": "Male",
        "blood_group": "O+",
        "conditions": ["Hypertension", "Type 2 Diabetes"],
        "medications": ["Metformin 500mg", "Lisinopril 10mg"],
        "vitals": {
            "bp": "130/85",
            "heart_rate": 78,
            "temperature": 98.6
        }
    }

@app.get("/api/hospitals")
async def get_hospitals():
    """Get hospital resources"""
    return {
        "hospitals": [
            {
                "id": "H001",
                "name": "City General Hospital",
                "beds": {
                    "general": {"available": 45, "total": 120},
                    "icu": {"available": 8, "total": 20}
                },
                "blood_bank": {
                    "A+": 25,
                    "O+": 32,
                    "B+": 18
                }
            }
        ]
    }

@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics():
    """Get dashboard analytics"""
    return {
        "total_patients": 2847,
        "ai_analyses": 1456,
        "scans_completed": 1378,
        "avg_wait_time": "12 min",
        "ai_accuracy": 94.8
    }

@app.get("/api/doctors/search")
async def search_doctors(disease: str = None):
    """Search doctors"""
    return {
        "doctors": [
            {
                "id": "D001",
                "name": "Dr. Sarah Johnson",
                "specialty": "Pulmonologist",
                "experience": "15 years",
                "rating": 4.9,
                "hospital": "City General Hospital",
                "availability": "Available Today"
            }
        ]
    }

@app.post("/api/appointments/book")
async def book_appointment(patient_id: str, doctor_id: str, slot: str):
    """Book appointment"""
    return {
        "appointment_id": f"APT{random.randint(1000, 9999)}",
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "slot": slot,
        "status": "confirmed",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting HealthAI Pro Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
