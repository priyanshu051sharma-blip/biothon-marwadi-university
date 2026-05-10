# Production Deployment Guide for Vercel

## ✅ What's Production Ready Now

Your Healthcare MVP frontend is now configured for production deployment with:
- ✅ Optimized build configuration (code splitting, minification)
- ✅ Security headers (XSS, CSRF, content-type protection)
- ✅ Proper caching strategy (immutable assets, revalidated HTML)
- ✅ Error handling for API failures
- ✅ Environment variable support
- ✅ SPA routing configured

---

## 🚀 Step-by-Step Production Deployment

### Step 1: Deploy Frontend to Vercel

Your code is already configured. Just push to GitHub:

```bash
cd "c:\Users\PRIYANSHU SHARMA\OneDrive\Desktop\mVP\Healthcare-MVP\unified-healthcare-platform"
git add .
git commit -m "chore: production-ready configuration for Vercel"
git push origin main
```

Vercel will auto-deploy within 30 seconds ✅

---

### Step 2: Deploy Backend Separately

**Your frontend is ready, but you need a backend server.**

Choose ONE:

#### Option A: Railway.app (Recommended for Python/FastAPI)
1. Go to [railway.app](https://railway.app)
2. Create account → New Project → Deploy from GitHub
3. Select `Healthcare-MVP` repository
4. Railway detects Python → configures automatically
5. Add environment variables (DATABASE_URL, etc.)
6. Get your backend URL: `https://your-project.railway.app`

#### Option B: Render.com
1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect GitHub repository
4. Runtime: Python 3.11
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables
8. Deploy

#### Option C: AWS/DigitalOcean/Heroku
Similar process - follow their Python/FastAPI deployment guides

---

### Step 3: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `healthcare-mvp` project
3. Click **Settings** → **Environment Variables**
4. Add this variable:

```
Variable Name:  VITE_API_URL
Value:          https://your-backend-domain.com
Environments:   Production (select this)
```

Then **Redeploy**:
- Deployments tab → "..." → Redeploy

---

### Step 4: Verify Deployment

**Frontend URL:** `https://healthcare-mvp-two.vercelapp`

**Check these:**
- [ ] Homepage loads (not 404)
- [ ] Navigation links work
- [ ] Open DevTools Console (F12)
  - Should NOT see 404 errors
  - Should see API calls to your backend URL

**Test API Connection:**
```javascript
// Open browser console and run:
fetch('https://your-backend-domain.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend OK:', d))
  .catch(e => console.error('Backend Error:', e))
```

---

## 🔒 Production Checklist

### Before Going Live

- [ ] **Backend is deployed** with correct URL
- [ ] **VITE_API_URL set** in Vercel environment
- [ ] **Frontend deployed and builds successfully**
- [ ] **Test all major routes** without 404
- [ ] **API calls work** (check Network tab in DevTools)
- [ ] **No console errors** in browser DevTools
- [ ] **Custom domain configured** (if needed)
  - Vercel Settings → Domains → Add custom domain
- [ ] **HTTPS enabled** (automatic on Vercel)
- [ ] **Security headers present** (checked in Network tab)

### Security Settings

In Vercel Dashboard → Settings:
- [ ] **Git** → Require approval for production deployments
- [ ] **Security** → Enable Preview Deployment Protection
- [ ] **Domains** → Configure custom domain with SSL

---

## 📊 Production Monitoring

### Enable Observability on Vercel

1. Dashboard → healthcare-mvp → Settings → Integrations
2. Connect to:
   - Sentry (error tracking)
   - Datadog (performance monitoring)
   - New Relic (application performance)

### Check Production Logs

Vercel → Deployments → Click Latest → **Logs** tab
- Build Logs (what happened during deployment)
- Runtime Logs (errors when users visit)

---

## 🐛 Troubleshooting Production Issues

### Issue: "Error Forbidden" or API calls fail

**Cause:** Backend not deployed or API URL wrong

**Fix:**
```bash
# Check what API URL is being used
# Open browser DevTools Console → Network tab
# Look at API calls, see what URL they're hitting

# If localhost: VITE_API_URL not set
# If wrong domain: Update in Vercel Settings → Environment Variables
```

### Issue: Deployment fails to build

**Check Build Logs:**
1. Vercel Dashboard → Deployments → Latest
2. Click on deployment
3. Click "Logs" button
4. Scroll to find error message
5. Share error here for help

**Common build errors:**
- Missing dependencies: Run `npm install` locally, commit lock file
- TypeScript errors: Fix types in your code
- Environment variables: Add required vars in Vercel Settings

### Issue: Frontend works but looks broken (styles/images missing)

**Cause:** Asset paths wrong after deployment

**Fix:**
```javascript
// In vite.config.js, ensure this is set:
build: {
  outDir: 'dist',
  assetFileNames: 'assets/[name]-[hash][extname]'
}
```

Then rebuild and redeploy:
```bash
cd frontend
rm -rf dist
npm run build
git add .
git commit -m "fix: rebuild assets"
git push
```

---

## 🚀 Optimization Tips for Production

### 1. Enable Vercel Analytics
```bash
npm install @vercel/web-analytics
```

Then add to `src/App.jsx`:
```javascript
import { Analytics } from "@vercel/web-analytics/react";

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

### 2. Optimize Images
- Use `.webp` format instead of `.png`
- Compress with: `npm install -D sharp`
- Add to build pipeline

### 3. Enable Gzip Compression
Vercel does this automatically ✅

### 4. Monitor Performance
- Vercel Dashboard → "Speed Insights" tab
- Check Core Web Vitals
- Optimize largest sections

---

## 📋 Environment Variables Reference

### Required for Production
```
VITE_API_URL=https://your-backend-domain.com
```

### Optional (If using)
```
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
VITE_ENVIRONMENT=production
```

---

## 🔄 Deployment Workflow

### For Future Updates

1. **Make changes locally**
   ```bash
   npm run dev  # Test locally
   ```

2. **Test production build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

4. **Vercel auto-deploys** (within 30 seconds)

5. **Check deployment**
   - Vercel Dashboard → Deployments
   - Click latest → "Visit" button

---

## ✨ Success Criteria

Your application is **production ready** when:

✅ Frontend deploys successfully to Vercel  
✅ Backend is deployed separately  
✅ `VITE_API_URL` environment variable set  
✅ Homepage loads without 404  
✅ Navigation routes work  
✅ API calls reach backend  
✅ No console errors  
✅ Custom domain configured (optional)  

---

## 📞 Getting Help

If you encounter issues:

1. **Check Vercel Logs** → Deployments → Logs tab
2. **Check Browser Console** → DevTools F12 → Console tab
3. **Check Network Tab** → DevTools F12 → Network tab
4. **Verify Backend** → Is it deployed and responding?
5. **Verify Environment Variables** → Are they set in Vercel?

---

## 📚 Useful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [React Router Guide](https://reactrouter.com)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Railway Deployment](https://docs.railway.app)
- [Render.com Guide](https://render.com/docs)

---

**Your Healthcare MVP is now production ready! 🎉**
