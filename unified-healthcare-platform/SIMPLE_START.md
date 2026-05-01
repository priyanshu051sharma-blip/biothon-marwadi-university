# 🚀 SIMPLE START - Get Running in 2 Minutes!

## ✅ Good News: Databases are Running!

Your PostgreSQL, MongoDB, and Redis are now running in Docker.

---

## 🎯 Quick Demo (No Backend Needed)

Let's start with just the frontend to see the UI:

### Step 1: Open Terminal in Frontend Folder

```bash
cd "C:\Users\PRIYANSHU SHARMA\OneDrive\Desktop\Healthcare system\unified-healthcare-platform\frontend"
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 3: Start Frontend

```bash
npm run dev
```

### Step 4: Open Browser

Go to: **http://localhost:3000**

---

## 🎨 What You'll See:

The frontend will load with:
- ✅ Dashboard UI
- ✅ Navigation menu
- ✅ All pages and components
- ⚠️ API calls will fail (backend not running yet)

This lets you see the complete UI and design!

---

## 🔧 To Get Full Functionality:

### Option 1: Run Backend Locally

**Terminal 1 - Keep frontend running**

**Terminal 2 - Start Backend:**
```bash
cd "C:\Users\PRIYANSHU SHARMA\OneDrive\Desktop\Healthcare system\unified-healthcare-platform\backend"
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Option 2: Use Mock Data

The frontend has mock data built-in, so you can explore:
- Dashboard with sample statistics
- Sample patient data
- Demo charts and analytics
- UI components

---

## 📊 Current Status:

✅ **Databases Running** (PostgreSQL, MongoDB, Redis)
✅ **Frontend Ready** (React app)
⏳ **Backend** (Needs Python setup)

---

## 🎯 Recommended Next Steps:

1. **See the UI First:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open: http://localhost:3000

2. **Then Add Backend** (if you want full features):
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --port 8000
   ```

---

## 💡 Pro Tips:

- The UI works standalone with mock data
- You can explore all pages and features
- Backend adds real AI functionality
- Databases are already running in Docker

---

## ❓ Troubleshooting:

### "npm not found"
Install Node.js from: https://nodejs.org/

### "python not found"
Install Python from: https://www.python.org/

### Port 3000 in use
```bash
# Change port in vite.config.js
# Or kill existing process
```

---

**Let's get you running! Start with the frontend first! 🚀**
