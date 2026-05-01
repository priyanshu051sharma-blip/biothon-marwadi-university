# Setup Guide - RIS AI Platform

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MongoDB (or use Docker)
- Git

## Quick Start (Development)

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 2. Environment Setup

Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ris-ai
AI_SERVICE_URL=http://localhost:8000
```

### 3. Start Services

Open 3 terminals:

Terminal 1 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
npm start
```

Terminal 3 - AI Service:
```bash
cd ai-service
python app.py
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

## Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

## Training Your Own Model

1. Prepare dataset in this structure:
```
data/
  train/
    normal/
    pneumonia/
    tuberculosis/
    covid19/
  val/
    normal/
    pneumonia/
    tuberculosis/
    covid19/
```

2. Run training:
```bash
cd ai-service
python train_model.py
```

3. Model will be saved to `models/pneumonia_detector.h5`

## Features to Test

1. Upload Scan - Upload chest X-ray image
2. View Reports - See generated reports with AI analysis
3. Analytics - View system performance metrics
4. Multilingual - Switch between languages

## Next Steps

- Integrate real medical image dataset
- Train CNN model on actual data
- Add authentication system
- Integrate with hospital PACS/EHR
- Deploy to cloud (AWS/GCP)
- Add more languages
- Implement voice features
