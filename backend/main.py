import os
import numpy as np

# 1. Force Legacy Keras
os.environ["TF_USE_LEGACY_KERAS"] = "1"

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

import tensorflow_hub as hub
import tf_keras
from tf_keras.models import load_model
from tf_keras.preprocessing import image

app = FastAPI()

# --- CONFIGURATION ---
MODEL_PATH = "model.h5" 
INPUT_SHAPE = (224, 224) 
CLASS_NAMES = ["cracks", "spalling", "stains", "vegetation"]

# --- WEIGHTED SCORING SYSTEM ---
# How "Safe" is this class? (0 = Collapse, 100 = Perfect)
SAFETY_WEIGHTS = {
    "cracks": 20,      # Structural failure risk
    "spalling": 40,    # Falling debris risk
    "vegetation": 65,  # Long-term damage risk
    "stains": 85       # Moisture risk
}

print(f"Loading model from: {MODEL_PATH}")

try:
    model = load_model(MODEL_PATH, custom_objects={'KerasLayer': hub.KerasLayer})
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ CRITICAL ERROR: {e}")
    model = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(INPUT_SHAPE)
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model failed to load."}

    try:
        contents = await file.read()
        processed_image = preprocess_image(contents)
        
        # 1. Get Raw Probabilities
        predictions = model.predict(processed_image)
        probs = predictions[0] # e.g., [0.10, 0.20, 0.60, 0.10]
        
        # 2. Calculate Weighted Health Score
        # Formula: Sum of (Probability * SafetyWeight)
        # Example: 0.6*85 (Stain) + 0.4*20 (Crack) = 51 + 8 = 59 Score
        final_score = 0
        detailed_defects = []

        for idx, score in enumerate(probs):
            class_name = CLASS_NAMES[idx]
            probability = float(score)
            
            # Add to score: (0.60 * 85)
            weight = SAFETY_WEIGHTS.get(class_name, 50)
            final_score += (probability * weight)

            # Add to list
            detailed_defects.append({
                "type": class_name.capitalize(),
                "confidence": round(probability * 100, 2), # <--- 2 Decimal Places
                "count": 1 if probability > 0.5 else 0
            })

        # 3. Finalize Score & Sort
        final_score = int(round(final_score))
        detailed_defects.sort(key=lambda x: x['confidence'], reverse=True)
        
        top_prediction = detailed_defects[0]

        # 4. Determine Status based on Calculated Score
        if final_score >= 80:
            status = "Safe"
            advice = "Wall is in good condition. Minor cosmetic issues only."
        elif final_score >= 60:
            status = "Caution"
            advice = "Signs of wear detected. Monitor for progression."
        else:
            status = "Critical"
            advice = "Significant structural or surface defects detected. Inspection recommended."

        return {
            "score": final_score,
            "status": status,
            "summary": f"Analysis Score: {final_score}/100. Primary detection: {top_prediction['type']} ({top_prediction['confidence']}%)",
            "defects": detailed_defects
        }

    except Exception as e:
        return {"error": str(e)}