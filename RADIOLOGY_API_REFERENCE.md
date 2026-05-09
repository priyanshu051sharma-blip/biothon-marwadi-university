# 📋 API Response Structure Reference

## Overview
This document specifies the exact JSON response format returned by the Radiology Hub API for frontend integration and data processing.

---

## POST /api/radiology/ensemble-analyze

### Request
```http
POST /api/radiology/ensemble-analyze HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data

Parameters:
- image: <binary file> (JPEG/PNG)
- scanType: "xray" or "ct" (Form field)
- authorization: (optional) "Bearer {jwt_token}" (Header)
```

### Response (Success - 200 OK)
```json
{
  "scanType": "xray",
  "original": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAYABgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAYEAADAAMAAAAAAAAAAAAAAAABAgMEEf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGBEAAwEBAAAAAAAAAAAAAAEAAQIRMf/aAAwDAQACEQMRAD8AuMh+OAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==",
  "models": {
    "densenet": {
      "label": "DenseNet121",
      "prediction": "Cancer Detected",
      "confidence": 0.8734,
      "heatmap": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/...",
      "overlay": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/..."
    },
    "resnet": {
      "label": "ResNet50",
      "prediction": "Cancer Detected",
      "confidence": 0.8412,
      "heatmap": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/...",
      "overlay": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/..."
    },
    "swin": {
      "label": "Swin Transformer",
      "prediction": "No Cancer Detected",
      "confidence": 0.5234,
      "heatmap": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/...",
      "overlay": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/..."
    }
  }
}
```

### Response Fields

#### Root Level
| Field | Type | Description |
|-------|------|-------------|
| `scanType` | string | Either `"xray"` or `"ct"` - echoes the request |
| `original` | string | Base64-encoded original image (data URI) |
| `models` | object | Dictionary of model results keyed by model_name |

#### Models Object
Dictionary where each key is a model identifier, value is model result object.

**Model Identifiers**:
- X-ray: `"densenet"`, `"resnet"`, `"swin"`
- CT: `"densenet"`, `"resnet"`, `"swin"` (Swin is proxy voting)

#### Model Result Object
| Field | Type | Description | Range |
|-------|------|-------------|-------|
| `label` | string | Human-readable model name | "DenseNet121", "ResNet50", "Swin Transformer" |
| `prediction` | string | Model's diagnosis | "Cancer Detected" or "No Cancer Detected" |
| `confidence` | number | Model's confidence score | 0.0 to 1.0 |
| `heatmap` | string | GradCAM visualization (data URI) | Base64 JPEG |
| `overlay` | string | Heatmap overlaid on original (data URI) | Base64 JPEG |

---

## Data Types & Formats

### Base64 Images
All image fields use data URIs:
```
data:image/jpeg;base64,{base64_encoded_image_bytes}
```

**How to use in HTML**:
```html
<img src="data:image/jpeg;base64,/9j/4AAQSkZJRg..." alt="Heatmap" />
```

**How to use in JavaScript**:
```javascript
// Display in img element
document.querySelector('img').src = response.models.densenet.heatmap

// Convert to Blob
function dataUriToBlob(dataUri) {
  const byteString = atob(dataUri.split(',')[1])
  const mimeString = dataUri.split(',')[0].match(/:(.*?);/)[1]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], {type: mimeString})
}

// Download heatmap
const blob = dataUriToBlob(response.models.densenet.heatmap)
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'heatmap.jpg'
a.click()
```

### Confidence Scoring
- **Range**: 0.0 to 1.0 (not percentages)
- **Conversion to percentage**: `Math.round(confidence * 100)`
- **Interpretation**:
  - 0.0 = 0% confidence
  - 0.5 = 50% confidence
  - 1.0 = 100% confidence

### Prediction Strings
**Exact values** (case-sensitive):
- `"Cancer Detected"` - Positive diagnosis
- `"No Cancer Detected"` - Negative diagnosis

**Recommendation**: Always use exact string matching for consistency.

---

## Example Processing in Frontend

### Parse Response
```javascript
async function handleAnalyzeResponse(response) {
  const data = response.data
  
  // Extract scan type
  const scanType = data.scanType // "xray" or "ct"
  
  // Get original image
  const originalImage = data.original // data URI
  
  // Process each model
  const modelResults = Object.entries(data.models).map(([key, model]) => ({
    modelKey: key,
    label: model.label,
    prediction: model.prediction,
    confidencePercent: Math.round(model.confidence * 100),
    confidenceDecimal: model.confidence,
    heatmapUri: model.heatmap,
    overlayUri: model.overlay,
    isCancer: model.prediction === "Cancer Detected",
    severity: determineSeverity(model.prediction)
  }))
  
  return { scanType, originalImage, modelResults }
}

// Determine severity for display
function determineSeverity(prediction) {
  const lower = prediction.toLowerCase()
  if (lower.includes('cancer') || lower.includes('tuberculosis')) return 'high'
  if (lower.includes('pneumonia') || lower.includes('bronchitis')) return 'moderate'
  return 'low'
}
```

### Find Best Model
```javascript
function findBestModel(modelResults) {
  return modelResults.reduce((best, current) => 
    current.confidenceDecimal > best.confidenceDecimal ? current : best
  )
}

// Usage
const best = findBestModel(modelResults)
console.log(`Top prediction: ${best.label} - ${best.prediction} (${best.confidencePercent}%)`)
```

### Render XAI Matrix
```javascript
function renderXAIMatrix(modelResults, originalImage) {
  const matrixHTML = modelResults.map(model => `
    <div class="model-card">
      <h3>${model.label}</h3>
      <p>Prediction: <strong>${model.prediction}</strong> | Confidence: <strong>${model.confidencePercent}%</strong></p>
      
      <div class="image-grid">
        <div class="panel">
          <p>SOURCE</p>
          <img src="${originalImage}" alt="Original" />
        </div>
        <div class="panel">
          <p>HEATMAP</p>
          <img src="${model.heatmapUri}" alt="Heatmap" />
        </div>
        <div class="panel">
          <p>COMPOSITE</p>
          <img src="${model.overlayUri}" alt="Overlay" />
        </div>
      </div>
    </div>
  `).join('')
  
  document.getElementById('xai-matrix').innerHTML = matrixHTML
}
```

### Export Report JSON
```javascript
function generateReport(data, scanType, fileName) {
  const report = {
    generated_at: new Date().toISOString(),
    scan_type: scanType,
    file_name: fileName,
    summary: {
      total_models: Object.keys(data.models).length,
      models_predictions: Object.entries(data.models).map(([key, model]) => ({
        model_key: key,
        label: model.label,
        prediction: model.prediction,
        confidence: model.confidence,
        confidence_percent: Math.round(model.confidence * 100)
      }))
    },
    full_response: data // Include complete response for audit trail
  }
  
  // Download
  const blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `radiology-report-${Date.now()}.json`
  a.click()
}
```

---

## Error Responses

### HTTP 400 - Invalid Request
```json
{
  "detail": "scanType must be either 'xray' or 'ct'"
}
```

### HTTP 404 - Endpoint Not Found
```
{fallback routing attempts next endpoint}
```

### HTTP 502 - Gateway Error (RIS Backend Unreachable)
```json
{
  "detail": "Cannot reach RIS inference service at http://127.0.0.1:8010. Start RIS backend and set RIS_API_URL if needed."
}
```

### HTTP 503 - Service Unavailable
```json
{
  "detail": "Service temporarily unavailable"
}
```

---

## Performance Metrics

### Expected Response Times
| Scan Type | Models | Total Time |
|-----------|--------|-----------|
| X-ray | 3 (PyTorch) | 2-5 seconds |
| CT | 3 (Keras/PyTorch) | 5-15 seconds |

**Breakdown** (typical):
- Image preprocessing: ~100-200ms
- Model loading (first run): ~1-2 seconds
- Parallel inference (3 models): ~1-3 seconds
- GradCAM generation: ~0.5-1 second
- Base64 encoding: ~100ms
- Network transmission: ~0.5-1 second

### Data Size
| Component | Typical Size |
|-----------|-------------|
| Original image (base64) | 50-200 kB |
| Heatmap (base64) | 20-50 kB |
| Overlay (base64) | 30-80 kB |
| **Total response** | **300-900 kB** |

---

## Testing with cURL

### Test X-ray Analysis
```bash
curl -X POST http://localhost:8000/api/radiology/ensemble-analyze \
  -F "image=@test_xray.jpg" \
  -F "scanType=xray" \
  -o response.json

# Pretty print response
cat response.json | jq .
```

### Test CT Analysis
```bash
curl -X POST http://localhost:8000/api/radiology/ensemble-analyze \
  -F "image=@test_ct.jpg" \
  -F "scanType=ct" \
  -o response.json
```

### Check Response Structure
```bash
# Count models in response
cat response.json | jq '.models | length'

# Extract all predictions
cat response.json | jq '.models[] | {label: .label, prediction: .prediction, confidence: .confidence}'

# Check if heatmaps are present
cat response.json | jq '.models[] | has("heatmap")'
```

---

## Validation Checklist

When integrating this API, verify:

- [ ] Response has `scanType` matching request
- [ ] Response has `original` image (base64)
- [ ] Response has `models` object with ≥3 entries
- [ ] Each model has: `label`, `prediction`, `confidence`, `heatmap`, `overlay`
- [ ] `confidence` is between 0.0 and 1.0
- [ ] `prediction` is exactly "Cancer Detected" or "No Cancer Detected"
- [ ] `heatmap` and `overlay` are valid base64 JPEG data URIs
- [ ] All base64 images decode without errors
- [ ] Images have reasonable file sizes (< 200 kB each)
- [ ] Response time meets expectations

---

## Debugging Tips

### Enable Console Logging
```javascript
// Add to RadiologyHub.jsx handleAnalyze()
console.log('API Response:', response.data)
console.log('Models:', Object.keys(response.data.models))
response.data.models.forEach(([key, model]) => {
  console.log(`${key}: ${model.label} - ${model.prediction} (${model.confidence})`)
})
```

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Upload image and run diagnostics
4. Find the POST request to `/api/radiology/ensemble-analyze`
5. Check Response tab for full JSON
6. Verify all expected fields present

### Verify Image URIs
```javascript
// In browser console
const response = /* paste response.json */
const img = new Image()
img.onload = () => console.log('Image loaded successfully')
img.onerror = () => console.log('Image failed to load')
img.src = response.models.densenet.heatmap
document.body.appendChild(img)
```

---

## API Versioning

**Current Version**: 1.0  
**Last Updated**: [Current Date]  
**Stability**: Stable

**Future Compatibility**:
- Response format guaranteed to be backward compatible
- New fields may be added at root or model level
- Existing fields will not be removed or renamed

---

**Documentation Complete** ✅
