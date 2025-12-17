import tensorflow as tf
import numpy as np
from PIL import Image

class ClothesModel:

    model = tf.keras.models.load_model('models/clothesClassificationV4.h5')

    classNames = [
        'Dress', 'Hoodies/Sweater', 'Jackets/Coats', 'Other/Non-Clothes Item', 'Shirt',
        'Shorts', 'Skirt', 'T-Shirt', 'Trousers/Pants/Jeans'
    ]
    
    def __init__(self, image):
        self.image = image
        
    def runModel(self):
        self.image = self.image.resize((256, 256))
        self.image = np.array(self.image) / 255.0
        self.image = np.expand_dims(self.image, axis=0)

        predictions = self.model.predict(self.image)
        predicted_class = np.argmax(predictions, axis=1)[0]
        confidence = np.max(predictions)

        prediction = self.classNames[predicted_class]
        return prediction, confidence
