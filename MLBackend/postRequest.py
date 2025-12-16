from keras.models import load_model
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from vehicleModel import VehicleModel
from clothesModel import ClothesModel
from foodModel import FoodModel
import base64
from io import BytesIO
import time
app = Flask(__name__)

CORS(app)
@app.route('/api/data', methods=['POST'])
def handleData():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    choice = request.form.get('choice')
    image = Image.open(image_file)
    inputImage = image.convert("RGB")
    if choice == "Vehicle":
        vehicleModel = VehicleModel(inputImage)
        prediction, confidence = vehicleModel.runModel()
    elif choice == "Clothes":
        clothesModel = ClothesModel(inputImage)
        prediction, confidence = clothesModel.runModel()
    elif choice == "Food":
        foodModel = FoodModel(inputImage)
        prediction, confidence = foodModel.runModel()
    
    buffer = BytesIO()
    inputImage.save(buffer, format="PNG")
    buffer.seek(0)
    encodedBytes = base64.b64encode(buffer.read())
    encodedString = encodedBytes.decode("utf-8")
    time.sleep(5)
    return jsonify({
        "message": "Image received successfully",
        "choice": choice,
        "prediction": prediction,
        "confidence": float(confidence),
        "image": encodedString
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)