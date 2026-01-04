import os

# 1. Force Legacy Keras
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import tf_keras
from tf_keras.models import load_model

# 2. IMPORT THE MISSING PIECE
import tensorflow_hub as hub

# Define filename
FILENAME = "model.h5"

print("--- DIAGNOSTIC START ---")
print(f"Current Working Directory: {os.getcwd()}")

if not os.path.exists(FILENAME):
    print("❌ ERROR: File NOT found!")
    exit()

print("Attempting to load model with tensorflow_hub custom object...")

try:
    # 3. THE FIX: TELL KERAS WHAT 'KerasLayer' IS
    model = load_model(
        FILENAME, 
        custom_objects={'KerasLayer': hub.KerasLayer}
    )
    print("✅ SUCCESS: Model loaded perfectly!")
    print("   You are ready to update main.py")
except Exception as e:
    print("\n❌ LOAD FAILED. Error:")
    print(e)