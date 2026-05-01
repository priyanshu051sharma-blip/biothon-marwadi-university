# HealthAI Pro - Production Deployment Guide

## 🚀 Production-Ready Healthcare Platform

A unified, market-ready healthcare intelligence platform integrating:
- AI-powered radiology analysis
- Multi-agent symptom intelligence
- GraphRAG decision support
- Real-time care coordination
- Comprehensive analytics dashboard

---

## 📋 Prerequisites

### System Requirements
- **OS:** Linux (Ubuntu 20.04+), macOS, or Windows Server
- **RAM:** Minimum 16GB (32GB recommended)
- **Storage:** 100GB+ SSD
- **GPU:** NVIDIA GPU with CUDA support (for ML models)

### Software Dependencies
- Docker 24.0+
- Docker Compose 2.20+
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+ or MongoDB 7+
- Redis 7+
- TigerGraph Cloud account

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx)                 │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   Frontend     │  │   Backend   │  │   ML Service    │
│   (React)      │  │  (FastAPI)  │  │   (Python)      │
└────────────────┘  └─────────────┘  └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   PostgreSQL   │  │ TigerGraph  │  │     Redis       │
│   (Primary DB) │  │ (Graph DB)  │  │    (Cache)      │
└────────────────┘  └─────────────┘  └─────────────────┘
```

---

## 🔧 Quick Start (Development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd unified-healthcare-platform

# Copy environment files
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env`:

```env
# Application
NODE_ENV=production
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/healthai
MONGODB_URI=mongodb://localhost:27017/healthai
REDIS_URL=redis://localhost:6379

# TigerGraph
TIGERGRAPH_HOST=https://your-instance.i.tgcloud.io
TIGERGRAPH_USERNAME=tigergraph
TIGERGRAPH_PASSWORD=your_password
TIGERGRAPH_GRAPH_NAME=HealthGraph

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Security
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRATION=86400

# AWS (for file storage)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=healthai-storage
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### 4. Initialize Database

```bash
# Run migrations
cd backend
python scripts/init_db.py

# Seed initial data
python scripts/seed_data.py
```

### 5. Start Services

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 3 - ML Service (optional)
cd ml_service
python app.py
```

Access: http://localhost:3000

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend/models:/app/models

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=healthai
      - POSTGRES_USER=healthai
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. Infrastructure Setup (Terraform)

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "healthai" {
  name = "healthai-cluster"
}

# RDS PostgreSQL
resource "aws_db_instance" "healthai_db" {
  identifier        = "healthai-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  
  db_name  = "healthai"
  username = "healthai"
  password = var.db_password
  
  backup_retention_period = 7
  multi_az               = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "healthai_cache" {
  cluster_id      = "healthai-cache"
  engine          = "redis"
  node_type       = "cache.t3.medium"
  num_cache_nodes = 1
}

# S3 for file storage
resource "aws_s3_bucket" "healthai_storage" {
  bucket = "healthai-storage"
}
```

#### 2. Deploy with AWS CLI

```bash
# Build and push Docker images
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t healthai-frontend ./frontend
docker tag healthai-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/healthai-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/healthai-frontend:latest

docker build -t healthai-backend ./backend
docker tag healthai-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/healthai-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/healthai-backend:latest

# Deploy to ECS
aws ecs update-service --cluster healthai-cluster --service healthai-backend --force-new-deployment
```

### GCP Deployment

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/healthai-backend
gcloud run deploy healthai-backend \
  --image gcr.io/PROJECT_ID/healthai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔒 Security Configuration

### SSL/TLS Setup

```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Monitoring & Logging

### Setup Monitoring

```bash
# Install Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Install Grafana
docker run -d -p 3001:3000 grafana/grafana
```

### Application Logging

```python
# backend/logging_config.py
import logging
from logging.handlers import RotatingFileHandler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/app.log', maxBytes=10485760, backupCount=10),
        logging.StreamHandler()
    ]
)
```

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=.

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 📈 Performance Optimization

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_patients_id ON patients(id);
CREATE INDEX idx_reports_patient_id ON reports(patient_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### Caching Strategy

```python
# Redis caching
from redis import Redis
redis_client = Redis(host='localhost', port=6379, decode_responses=True)

# Cache patient data
redis_client.setex(f"patient:{patient_id}", 3600, json.dumps(patient_data))
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and test
        run: |
          npm install
          npm test
          
      - name: Deploy to AWS
        run: |
          aws ecs update-service --cluster healthai --service backend --force-new-deployment
```

---

## 📱 Mobile App (Future)

- React Native for iOS/Android
- Offline-first architecture
- Push notifications
- Biometric authentication

---

## 🆘 Support & Maintenance

### Health Checks

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check database connection
curl https://api.yourdomain.com/health/db
```

### Backup Strategy

```bash
# Daily database backup
pg_dump healthai > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).sql s3://healthai-backups/
```

---

## 📄 License & Compliance

- HIPAA Compliance Ready
- GDPR Compliant
- SOC 2 Type II (in progress)
- FDA Medical Device Classification (Class II)

---

## 📞 Contact & Support

- **Email:** support@healthai.com
- **Documentation:** https://docs.healthai.com
- **Status Page:** https://status.healthai.com

---

**HealthAI Pro** - Revolutionizing Healthcare with AI
