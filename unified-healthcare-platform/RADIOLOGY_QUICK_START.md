# 🚀 Radiology Hub Quick Start Guide

## What's New?
HealthAI Pro now includes an **AI Radiology Analysis** page with ensemble ML inference for CT and X-ray scans, featuring explainable AI (XAI) visualizations.

---

## Quick Start (5 minutes)

### 1️⃣ Start RIS Backend (ML Inference Engine)
```powershell
# Open PowerShell Terminal 1
cd d:\Khushi Kathuria\Healthcare\Healthcare-MVP\RIS\backend

# Create virtual environment (first time only)
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start server on port 8010
python -m uvicorn main:app --host 0.0.0.0 --port 8010
```
✅ Should see: `Uvicorn running on http://0.0.0.0:8010`

---

### 2️⃣ Start HealthAI Backend (API Proxy)
```powershell
# Open PowerShell Terminal 2
cd d:\Khushi Kathuria\Healthcare\Healthcare-MVP\unified-healthcare-platform\backend

# Create virtual environment (first time only)
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start server on port 8000
python -m uvicorn main:app --reload --port 8000
```
✅ Should see: `Uvicorn running on http://127.0.0.1:8000`

---

### 3️⃣ Start Frontend (React + Vite)
```powershell
# Open PowerShell Terminal 3
cd d:\Khushi Kathuria\Healthcare\Healthcare-MVP\unified-healthcare-platform\frontend

# Install dependencies (first time only)
npm install

# Start dev server on port 5174
npm run dev
```
✅ Should see: `Local: http://localhost:5174`

---

### 4️⃣ Access Radiology Hub
1. Open browser: **http://localhost:5174**
2. Navigate to **Radiology Hub** from sidebar
3. You should see:
   - Left panel: Upload zone + Scan type selector
   - Right panel: Empty (waiting for analysis)

---

## Using Radiology Hub

### Upload a Scan
1. **Click upload area** or drag-drop an image
   - Supported formats: JPEG, PNG
   - Recommended size: 224x224 px (X-ray) or 512x512 px (CT)
2. **Select Scan Type**:
   - ✅ **Radiography (X-Ray)**: For chest/limb scans
   - ✅ **Computed Tomography (CT)**: For 3D volumetric scans

### Run Diagnostics
1. Click **"Run Diagnostics"** button
2. Wait for processing (typically 5-15 seconds for 3 models)
3. See loading spinner: "AI is processing model ensemble..."

### View Results
The right panel will show:

#### 📊 Top Prediction
- **Diagnosis**: The most confident prediction (e.g., "Cancer Detected")
- **Confidence**: Percentage confidence from top model
- **Severity**: Color-coded indicator
  - 🔴 High severity (red)
  - 🟡 Moderate severity (yellow)  
  - 🟢 Low severity (green)

#### 📋 Model Findings
- List of all models' predictions and confidences
- Shows agreement/disagreement between models
- Example:
  - DenseNet121: Cancer Detected (89%)
  - ResNet50: Cancer Detected (84%)
  - Swin Transformer: No Cancer Detected (52%)

#### 🎨 XAI Matrix
- **One card per model** (e.g., 3 cards for 3 models)
- **Each card shows**:
  - Model name & top prediction
  - Prediction confidence
  - 3-column grid:
    - **SOURCE**: Original uploaded scan
    - **HEATMAP**: Model's attention/saliency map
    - **COMPOSITE**: Heatmap overlaid on original

#### ⬇️ Download Report
- Click **"Download Report JSON"** to save full analysis
- Contains all model outputs, heatmaps, and metadata

---

## Understanding XAI Visualizations

### 🔍 SOURCE Column
Your uploaded scan image (resized to model input size)

### 🔥 HEATMAP Column
Shows where the model "looks" for making decisions:
- **Bright areas** = high attention (important for prediction)
- **Dark areas** = low attention (less important)
- Generated using GradCAM (gradient-weighted class activation mapping)

### 🎯 COMPOSITE Column
Overlay of heatmap on original scan:
- Shows important regions highlighted on actual anatomy
- Helps radiologist understand model reasoning
- Better visualization for clinical interpretation

---

## Example Workflow

```
1. Upload CT scan (512x512 JPEG)
   ↓
2. Select "Computed Tomography (CT)"
   ↓
3. Click "Run Diagnostics"
   ↓
4. Wait 5-15 seconds (models loading + inference)
   ↓
5. See Results:
   - Top Prediction: "Cancer Detected" (87% confidence)
   - 3 Models shown in XAI Matrix
   - Each with SOURCE | HEATMAP | COMPOSITE visualizations
   ↓
6. Download report for record keeping
```

---

## Troubleshooting

### ❌ "Unable to run RIS ensemble analysis"
**Problem**: Appears in red box on right panel

**Solution**:
1. ✅ Verify RIS backend is running on port 8010
   ```powershell
   # In Terminal 1, should see:
   # Uvicorn running on http://0.0.0.0:8010
   ```
2. ✅ Verify HealthAI backend is running on port 8000
   ```powershell
   # In Terminal 2, should see:
   # Uvicorn running on http://127.0.0.1:8000
   ```
3. ✅ Check browser console for network errors (F12 → Network tab)

### ❌ "No reachable radiology inference endpoint found"
**Problem**: All 3 API attempts failed

**Solution**:
1. Check both backends are actually running (see above)
2. Verify ports are correct (8010 for RIS, 8000 for HealthAI)
3. Check RIS backend logs for inference errors
4. Try smaller image file first (test case)

### ⏱️ "This can take longer for CT scans"
**Normal behavior**: CT scans require more computation than X-rays
- X-ray: typically 2-5 seconds
- CT: typically 5-15 seconds

**Factors**:
- GPU availability (much faster with CUDA)
- Model sizes (DenseNet/ResNet/Swin)
- Image resolution

### 🖼️ "Not available" in image panels
**Problem**: Heatmap or overlay not generated

**Possible causes**:
- Model inference failed (check RIS backend logs)
- Image too small or corrupted
- GPU out of memory

**Solution**: Try with a different image or restart RIS backend

---

## Model Details

### X-Ray Models (3 models in parallel)
| Model | Framework | Classes | Speed |
|-------|-----------|---------|-------|
| DenseNet121 | PyTorch | Binary: Cancer/No Cancer | Fast |
| ResNet50 | PyTorch | Binary: Cancer/No Cancer | Fast |
| Swin Transformer | PyTorch | Binary: Cancer/No Cancer | Slower |

### CT Models (3 models in parallel)
| Model | Framework | Classes | Speed |
|-------|-----------|---------|-------|
| DenseNet121 | Keras | Binary: Cancer/No Cancer | Medium |
| ResNet50 | Keras | Binary: Cancer/No Cancer | Medium |
| Swin Proxy | Voting Ensemble | Binary: Cancer/No Cancer | Fast |

---

## File Locations

### 📁 Frontend Code
- Location: `unified-healthcare-platform/frontend/src/pages/RadiologyHub.jsx`
- Size: ~550 lines of React + inline CSS
- No external dependencies needed

### 📁 Backend Proxy
- Location: `unified-healthcare-platform/backend/main.py` (line 254)
- Endpoint: `POST /api/radiology/ensemble-analyze`
- Forwards to: `RIS/backend/main.py` on port 8010

### 📁 ML Inference
- Location: `RIS/backend/main.py` (line 539)
- Endpoint: `POST /api/analyze`
- Models: PyTorch (X-ray) + Keras (CT)

---

## Tips & Tricks

### 💡 Test with Sample Images
1. Create a test folder with sample scans
2. Use consistent image sizes (224x224 for X-ray, 512x512 for CT)
3. Test both JPEG and PNG formats

### 💡 Monitor API Calls
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Click "Run Diagnostics"
4. Watch requests:
   - Primary: `POST /api/radiology/ensemble-analyze`
   - Response shows all 3 models with heatmaps

### 💡 Check Backend Logs
- RIS backend: Terminal 1 - shows model loading & inference time
- HealthAI backend: Terminal 2 - shows proxy requests & status

### 💡 Performance Tuning
- If slow, check GPU usage (RIS backend logs)
- Reduce image size if memory issues
- Use CPU-optimized models if GPU unavailable

---

## Next Steps

After testing basic functionality:

1. **Try different scan types** (X-ray vs CT)
2. **Experiment with heatmap interpretation**
3. **Download reports** and verify JSON structure
4. **Check model agreement** - do all 3 models agree?
5. **Monitor inference time** - baseline for production

---

## Support & Issues

### 🐛 Report Issues
1. Note exact error message
2. Check browser console (F12 → Console tab)
3. Check backend logs (Terminal 1 & 2)
4. Verify all 3 services running on correct ports
5. Try clearing browser cache (Ctrl+Shift+Del)

### 📚 Documentation
- Full integration details: `RADIOLOGY_INTEGRATION_COMPLETE.md`
- System architecture: `FINAL_SYSTEM_OVERVIEW.md`
- Setup guide: `SETUP.md`

---

## Performance Expectations

### ✅ Fast (< 2 seconds)
- Image upload processing
- UI rendering
- Download report generation

### ⏳ Medium (2-5 seconds)
- X-ray model inference (3 models in parallel)
- RIS backend response

### 🐢 Slow (5-15 seconds)
- CT model inference (larger models, more compute)
- First run (model loading from disk)

**Note**: Times depend on CPU/GPU availability and image size

---

## Success Checklist

- [ ] RIS backend running on port 8010
- [ ] HealthAI backend running on port 8000
- [ ] Frontend accessible on port 5174
- [ ] Can upload image to Radiology Hub
- [ ] "Run Diagnostics" completes without error
- [ ] See Top Prediction section with diagnosis & confidence
- [ ] See XAI Matrix with ≥3 model cards
- [ ] Each model shows SOURCE | HEATMAP | COMPOSITE
- [ ] Can download report JSON
- [ ] Results match expected model outputs

---

**🎉 You're all set! Start exploring the Radiology Hub.**

**Questions?** Check the terminal logs in Terminals 1 & 2 for detailed inference information.
