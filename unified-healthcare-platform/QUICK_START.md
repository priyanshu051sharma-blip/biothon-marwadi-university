# 🚀 HealthAI Pro - Quick Start Guide

## Welcome to HealthAI Pro!

This guide will get you up and running in **under 10 minutes**.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **Python 3.10+** installed ([Download](https://www.python.org/))
- ✅ **Git** installed ([Download](https://git-scm.com/))

---

## ⚡ Option 1: Docker (Recommended - Fastest)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd unified-healthcare-platform
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (optional for local dev)
# nano .env  # or use your favorite editor
```

### Step 3: Start Everything

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Default Login Credentials

```
Email: admin@healthai.com
Password: admin123
```

**That's it! You're ready to go! 🎉**

---

## 💻 Option 2: Local Development

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd unified-healthcare-platform
```

### Step 2: Install Dependencies

```bash
# Install all dependencies at once
npm run install-all

# Or install separately:

# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
```

### Step 4: Start Services

Open 3 terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Database (optional):**
```bash
# If you have PostgreSQL installed locally
psql -U postgres -c "CREATE DATABASE healthai;"

# Or use Docker for database only
docker run -d -p 5432:5432 -e POSTGRES_DB=healthai -e POSTGRES_PASSWORD=postgres postgres:15
```

### Step 5: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🎯 First Steps After Installation

### 1. Explore the Dashboard

Navigate to http://localhost:3000 and log in:
- View real-time statistics
- Check recent activity
- Explore analytics charts

### 2. Try Radiology Analysis

1. Go to **Radiology** page
2. Upload a sample X-ray image
3. Click **Analyze**
4. View AI-generated report with heatmap

### 3. Test Symptom Analysis

1. Go to **Symptom Analysis** page
2. Enter symptoms: "chest pain and shortness of breath"
3. Click **Analyze**
4. View disease predictions and reasoning path

### 4. Explore Care Coordination

1. View recommended doctors
2. Check hospital availability
3. See suggested lab tests
4. Try booking an appointment

---

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

```env
# Application
NODE_ENV=development
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthai
MONGODB_URI=mongodb://localhost:27017/healthai
REDIS_URL=redis://localhost:6379

# AI Services (Optional - for production features)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# TigerGraph (Optional - for GraphRAG features)
TIGERGRAPH_HOST=your_instance_url
TIGERGRAPH_USERNAME=tigergraph
TIGERGRAPH_PASSWORD=your_password
```

---

## 📚 Key Features to Try

### 1. AI Radiology Analysis
- Upload medical images (X-ray, CT scan)
- Get instant AI analysis
- View explainable heatmaps
- Generate multilingual reports

### 2. Symptom Intelligence
- Natural language symptom input
- Voice input support
- AI disease prediction
- Risk stratification
- Visual reasoning paths

### 3. Patient Management
- Digital health twin
- Complete medical history
- Timeline visualization
- Proactive health insights

### 4. Care Coordination
- Doctor recommendations
- Hospital capacity monitoring
- Lab test suggestions
- One-click booking

### 5. Analytics Dashboard
- Real-time metrics
- Performance tracking
- AI model monitoring
- Business intelligence

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# Kill the process
kill -9 <PID>
```

### Docker Issues

```bash
# Reset Docker
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up --build
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres
```

### Python Dependencies Error

```bash
# Upgrade pip
pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📖 Next Steps

### Learn More

- 📘 [Full Documentation](./README.md)
- 🚀 [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- ✅ [Launch Checklist](./LAUNCH_CHECKLIST.md)
- 💼 [Market Ready Summary](./MARKET_READY_SUMMARY.md)

### Customize

- Add your own ML models
- Configure TigerGraph
- Integrate with your EHR
- Customize UI theme
- Add new features

### Deploy

- Deploy to AWS/GCP/Azure
- Set up CI/CD pipeline
- Configure monitoring
- Enable SSL/HTTPS
- Scale infrastructure

---

## 🆘 Need Help?

### Documentation
- API Docs: http://localhost:8000/docs
- User Guide: [Link to docs]
- Video Tutorials: [Link to videos]

### Support
- Email: support@healthai.com
- Discord: [Link to Discord]
- GitHub Issues: [Link to issues]

### Community
- Forum: [Link to forum]
- Slack: [Link to Slack]
- Twitter: [@healthaipro]

---

## 🎓 Sample Data

### Test Credentials

```
Admin User:
Email: admin@healthai.com
Password: admin123

Doctor User:
Email: doctor@healthai.com
Password: doctor123

Patient User:
Email: patient@healthai.com
Password: patient123
```

### Sample Images

Sample medical images are available in:
```
/sample-data/xrays/
/sample-data/ct-scans/
```

### Sample Symptoms

Try these symptom descriptions:
- "chest pain and shortness of breath for 2 days"
- "severe headache with nausea and dizziness"
- "persistent cough with fever for a week"
- "abdominal pain in lower right quadrant"

---

## ⚙️ Advanced Configuration

### Enable All Features

To enable all production features, you'll need:

1. **OpenAI API Key** - For advanced NLP
2. **Anthropic API Key** - For Claude AI
3. **TigerGraph Cloud** - For GraphRAG
4. **AWS Account** - For file storage
5. **SMTP Server** - For email notifications

### Performance Tuning

```bash
# Increase backend workers
uvicorn main:app --workers 8

# Enable Redis caching
REDIS_URL=redis://localhost:6379

# Optimize database
# See PRODUCTION_DEPLOYMENT.md
```

---

## 🎉 You're All Set!

You now have a fully functional healthcare AI platform running locally.

**Next Steps:**
1. ✅ Explore all features
2. ✅ Try sample data
3. ✅ Read documentation
4. ✅ Customize for your needs
5. ✅ Deploy to production

**Happy Building! 🚀**

---

**HealthAI Pro - Where Intelligence Meets Care** 🏥
