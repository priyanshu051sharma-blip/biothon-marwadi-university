from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load pre-trained model (placeholder - replace with actual trained model)
# model = tf.keras.models.load_model('models/pneumonia_detector.h5')

class AIAnalyzer:
    def __init__(self):
        self.model = None  # Load your trained model here
        
    def preprocess_image(self, image_path):
        """Preprocess image for model input"""
        img = cv2.imread(image_path)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        return np.expand_dims(img, axis=0)
    
    def generate_heatmap(self, image_path, prediction):
        """Generate Grad-CAM heatmap"""
        # Simplified heatmap generation
        img = cv2.imread(image_path)
        heatmap = np.random.rand(img.shape[0], img.shape[1])
        heatmap = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', overlay)
        img_str = base64.b64encode(buffer).decode()
        return f"data:image/jpeg;base64,{img_str}"
    
    def predict(self, image_path):
        """Run inference on image"""
        # Mock prediction for MVP
        predictions = {
            'normal': 0.15,
            'pneumonia': 0.75,
            'tuberculosis': 0.08,
            'covid19': 0.02
        }
        
        diagnosis = max(predictions, key=predictions.get)
        confidence = predictions[diagnosis] * 100
        
        findings = []
        if diagnosis == 'pneumonia':
            findings = [
                'Opacity noted in right lower lobe',
                'No pleural effusion detected',
                'Heart size within normal limits',
                'Costophrenic angles are sharp'
            ]
        elif diagnosis == 'normal':
            findings = [
                'Clear lung fields bilaterally',
                'No focal consolidation',
                'Normal cardiac silhouette',
                'No pleural effusion'
            ]
        
        return {
            'diagnosis': diagnosis.capitalize(),
            'confidence': round(confidence, 1),
            'findings': findings,
            'predictions': predictions
        }

analyzer = AIAnalyzer()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_path = data.get('imagePath')
        language = data.get('language', 'en')
        
        # Run AI analysis
        result = analyzer.predict(image_path)
        
        # Generate heatmap
        heatmap_url = analyzer.generate_heatmap(image_path, result)
        
        # Generate recommendation
        recommendations = {
            'pneumonia': 'Antibiotic therapy recommended. Follow-up chest X-ray in 2 weeks to assess resolution.',
            'normal': 'No immediate intervention required. Routine follow-up as scheduled.',
            'tuberculosis': 'Refer to infectious disease specialist. Initiate isolation protocols.',
            'covid19': 'Isolate patient. Initiate COVID-19 treatment protocol. Monitor oxygen saturation.'
        }
        
        response = {
            **result,
            'recommendation': recommendations.get(result['diagnosis'].lower(), 'Consult with radiologist'),
            'heatmapUrl': heatmap_url
        }
        
        # Translate if needed
        if language != 'en':
            response = translate_report(response, language)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def translate_report(report, target_lang):
    """Translate report to target language"""
    # Mock translation - integrate with Google Translate API
    translations = {
        'hi': {
            'Pneumonia': 'निमोनिया',
            'Normal': 'सामान्य',
            'Tuberculosis': 'तपेदिक'
        },
        'ta': {
            'Pneumonia': 'நிமோனியா',
            'Normal': 'இயல்பானது',
            'Tuberculosis': 'காசநோய்'
        }
    }
    
    if target_lang in translations:
        report['diagnosis'] = translations[target_lang].get(report['diagnosis'], report['diagnosis'])
    
    return report

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'AI Analysis Service'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
