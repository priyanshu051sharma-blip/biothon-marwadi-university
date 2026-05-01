# 🚀 Quick Run Guide - HealthAI Pro

## Choose Your Method:

---

## ✅ Method 1: One-Click Start (Easiest)

### Windows:
```bash
# Double-click this file:
start.bat
```

### Mac/Linux:
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

**That's it!** The platform will start automatically.

---

## ✅ Method 2: Docker Compose (Recommended)

### Step 1: Ensure Docker is Running
- Open Docker Desktop
- Wait for it to fully start

### Step 2: Start Platform
```bash
docker-compose up -d
```

### Step 3: Wait 30 seconds for services to initialize

### Step 4: Access Application
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Login Credentials:
```
Email: admin@healthai.com
Password: admin123
```

---

## ✅ Method 3: Local Development (Advanced)

### Prerequisites:
- Node.js 18+
- Python 3.10+
- PostgreSQL (or use Docker for DB only)

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Start Services (3 terminals)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Database (optional):**
```bash
docker run -d -p 5432:5432 -e POSTGRES_DB=healthai -e POSTGRES_PASSWORD=postgres postgres:15
```

---

## 📊 What You'll See:

### Dashboard Features:
- ✅ Real-time statistics
- ✅ Patient management
- ✅ AI radiology analysis
- ✅ Symptom intelligence
- ✅ Care coordination
- ✅ Analytics charts

### Try These Features:
1. **Upload X-ray** → Go to Radiology page
2. **Analyze Symptoms** → Go to Symptom Analysis
3. **View Analytics** → Check Dashboard
4. **Manage Patients** → Go to Patients page

---

## 🛠️ Useful Commands:

### View Logs:
```bash
docker-compose logs -f
```

### Stop Platform:
```bash
docker-compose down
```

### Restart Platform:
```bash
docker-compose restart
```

### Rebuild (after code changes):
```bash
docker-compose up -d --build
```

---

## ❓ Troubleshooting:

### Port Already in Use:
```bash
# Stop existing services
docker-compose down

# Or change ports in docker-compose.yml
```

### Docker Not Running:
- Open Docker Desktop
- Wait for it to start
- Try again

### Services Not Starting:
```bash
# Check logs
docker-compose logs

# Reset everything
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 Next Steps:

1. ✅ Explore the dashboard
2. ✅ Try uploading a medical image
3. ✅ Test symptom analysis
4. ✅ Read full documentation (README.md)
5. ✅ Customize for your needs

---

## 🆘 Need Help?

- **Documentation:** See README.md
- **Quick Start:** See QUICK_START.md
- **Deployment:** See PRODUCTION_DEPLOYMENT.md
- **Issues:** Check logs with `docker-compose logs`

---

**Enjoy your Healthcare AI Platform! 🏥**
