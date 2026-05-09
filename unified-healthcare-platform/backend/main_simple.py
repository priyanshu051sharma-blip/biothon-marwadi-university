"""
Simplified Healthcare Platform Backend
FastAPI server with mock data for demo
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import random
import os
import httpx
from urllib.parse import quote

app = FastAPI(
    title="HealthAI Pro API",
    version="2.0.0",
    description="Unified Healthcare Intelligence Platform"
)

RIS_API_URL = os.getenv("RIS_API_URL", "http://127.0.0.1:8010").rstrip("/")

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
        heatmap_svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
    <defs>
        <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='#081A2D'/>
            <stop offset='100%' stop-color='#0F3D5E'/>
        </linearGradient>
        <radialGradient id='hotspot' cx='52%' cy='40%' r='45%'>
            <stop offset='0%' stop-color='#FFEB3B' stop-opacity='0.95'/>
            <stop offset='42%' stop-color='#FF9800' stop-opacity='0.65'/>
            <stop offset='100%' stop-color='#E53935' stop-opacity='0'/>
        </radialGradient>
    </defs>
    <rect width='1200' height='800' fill='url(#bg)'/>
    <rect x='70' y='70' width='1060' height='660' rx='28' fill='#FFFFFF' fill-opacity='0.08' stroke='#FFFFFF' stroke-opacity='0.2'/>
    <ellipse cx='600' cy='340' rx='300' ry='220' fill='url(#hotspot)'/>
    <circle cx='600' cy='340' r='160' fill='#FFEE58' fill-opacity='0.22'/>
    <text x='80' y='760' fill='#EAF2F8' font-family='Arial, sans-serif' font-size='34' font-weight='700'>AI Radiology Heatmap Preview</text>
    <text x='80' y='800' fill='#CFE2F3' font-family='Arial, sans-serif' font-size='22'>Demo overlay generated for {file.filename}</text>
</svg>"""
        heatmap_url = f"data:image/svg+xml;utf8,{quote(heatmap_svg)}"
    
    return {
        "report_id": f"R{random.randint(1000, 9999)}",
        "diagnosis": random.choice(diseases),
        "confidence": round(random.uniform(0.85, 0.98), 3),
        "findings": findings,
        "severity": random.choice(["mild", "moderate", "severe"]),
        "recommendation": "Immediate consultation with pulmonologist recommended",
        "language": language,
                "heatmap_url": heatmap_url,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/radiology/ensemble-analyze")
async def analyze_radiology_ensemble(
    image: UploadFile = File(...),
    scanType: str = Form("xray"),
    authorization: Optional[str] = Header(default=None),
):
    """Proxy RIS ensemble inference endpoint for CT/X-ray model matrix outputs."""
    scan_type = scanType.lower().strip()
    if scan_type not in {"xray", "ct"}:
        raise HTTPException(status_code=400, detail="scanType must be either 'xray' or 'ct'")

    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded image is empty")

        files = {
            "image": (
                image.filename or "scan.jpg",
                image_bytes,
                image.content_type or "application/octet-stream",
            )
        }
        data = {"scanType": scan_type}
        headers = {}
        if authorization:
            headers["Authorization"] = authorization

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{RIS_API_URL}/api/analyze",
                data=data,
                files=files,
                headers=headers,
            )

        if response.status_code >= 400:
            detail = "RIS inference request failed"
            try:
                detail = response.json().get("detail", detail)
            except Exception:
                pass
            raise HTTPException(status_code=response.status_code, detail=detail)

        return response.json()
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Cannot reach RIS inference service at {RIS_API_URL}. "
                "Start RIS backend and set RIS_API_URL if needed."
            ),
        )

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
