# Detectify — Machine Learning Image Classification App

Detectify is a full-stack machine learning image classification application that allows users to upload images and classify them into different Vehicle categories, clothes categories, or Food categories using deep learning models built with TensorFlow/Keras.

## Features
Upload an image directly from the browser

- Choose between Vehicle, Clothes, or Food classification

- Get a predicted class with a confidence score

- Preview uploaded images before submission

- Loading screen during model inference

- Input validation and user-friendly alerts

- Easy re-classification workflow

## System Architecture
![System Architecture](ReadMeFiles/Concept%20map.png)

## Machine Learning Models Design and Training Pipeline


All classification tasks in this project (vehicle, clothing, food, and animal categories) were implemented using custom-built Convolutional Neural Networks (CNNs) developed with TensorFlow and Keras. Each model was trained independently on its own dataset but followed a consistent, well-structured training pipeline.

### Dataset Preparation & Cleaning

Datasets were loaded directly from directory structures using image_dataset_from_directory, allowing automatic label assignment based on folder names. Before training, image quality and integrity were addressed through a data cleaning step, where invalid or corrupted image files were detected using OpenCV and imghdr and removed to prevent runtime errors or noisy learning signals.

This ensured:

Only valid image formats were used (jpg, png, jpeg, bmp)

Training stability and consistent batch loading

Reduced risk of hidden dataset corruption

### Data Preprocessing & Normalization

Once loaded, images were:

Resized to 256 × 256 pixels

Converted to RGB format (3 channels)

Normalized to a [0, 1] range by dividing pixel values by 255

Normalization improves numerical stability and allows the optimizer to converge faster during backpropagation.

### Dataset Splitting Strategy

Each dataset was split programmatically into:

70% training

20% validation

10% testing

This split was done using TensorFlow dataset operations (take and skip), ensuring:

No data leakage between sets

Reliable validation metrics during training

A final unseen test set for evaluation

### CNN Architecture Design

Each model follows a deep convolutional architecture, progressively learning higher-level visual features:

Convolutional Layers (Conv2D)
Three convolutional blocks with increasing filter sizes (16 → 32 → 64) extract spatial features such as edges, textures, and object shapes.

Activation Function (ReLU)
Introduced non-linearity to enable learning complex image patterns.

MaxPooling Layers
Reduced spatial dimensions, improving computational efficiency and providing translation invariance.

Flatten Layer
Converted feature maps into a 1D vector for classification.

Fully Connected Dense Layer
A dense layer with 256 neurons learned high-level feature combinations.

Dropout Regularization (50%)
Randomly deactivated neurons during training to reduce overfitting and improve generalization.

Softmax Output Layer
The final layer used softmax activation to output class probabilities, with the number of neurons matching the number of classes (e.g., 8 vehicle classes, 9 clothing classes, etc.).

### Model Compilation

All models were compiled using:

Adam optimizer, chosen for its adaptive learning rate and fast convergence

Sparse Categorical Crossentropy loss, suitable for multi-class classification with integer labels

Accuracy metric to monitor classification performance

### Training Process & Monitoring

Models were trained for 20 epochs, balancing learning capacity and overfitting risk.
Training progress was monitored using TensorBoard callbacks, enabling visualization of:

Training vs. validation loss

Training vs. validation accuracy

Signs of underfitting or overfitting over time

### Performance Visualization

After training, custom plots were generated to visualize:

Loss curves, showing optimization behavior

Accuracy curves, comparing training and validation performance

These visualizations helped verify that models were learning meaningful patterns rather than memorizing the data.

### Model Persistence

Once training completed, models were saved in .h5 format using Keras’ serialization utilities. This allowed:

Reuse without retraining

Deployment in a backend inference service

Integration with cloud-based deployment workflows

Each model version was saved independently to support iteration and experimentation across datasets.

# Running Models For Predictions
This application uses a full end-to-end inference pipeline that connects a React frontend to a Flask backend, which dynamically selects and executes the appropriate machine learning model based on user input.

The system is designed to support multiple image classification domains (Vehicle, Clothes, Food) through a single API endpoint, while keeping model logic modular and scalable.

## React Frontend
The React frontend serves as the user interface for model inference. The user:

- Uploads an image file

- Selects a classification type (Vehicle, Clothes, or Food)

- Submits the request for prediction

Before submission:

- The selected image is previewed locally using the FileReader API

- Input validation ensures both an image and classification choice are provided

- A loading overlay is displayed while inference is running

When the form is submitted, the frontend constructs a FormData object containing:

- image: the uploaded image file

- choice: selected classification type

additional metadata (e.g., user identifier)

This data is sent via a POST request to the Flask API:

```Python 
POST /api/data
```
### Backend Inference Logic (Flask API)
The Flask backend exposes a single inference endpoint responsible for handling all classification requests.

Request Handling

- When a request reaches the backend:

- The uploaded image is retrieved from request.files

- The selected classification type is read from request.form

- The image is converted to RGB format using PIL to ensure consistency across models

Dynamic Model Selection

- Based on the choice value sent by the frontend, the backend dynamically routes the image to the correct model class:

    - Vehicle → VehicleModel

    - Clothes → ClothesModel

    - Food → FoodModel

- This design avoids conditional logic inside the models themselves and keeps each model fully isolated and reusable.

### Model Execution Layer
Each classification domain is encapsulated in its own Python class, responsible for:

- Loading the trained .h5 model once

- Applying the same preprocessing steps used during training

- Running inference and returning results in a standardized format

- Image Preprocessing (Consistent Across Models)

- Batch dimension expansion to match model input shape

This ensures inference conditions exactly match the training pipeline.

Prediction Logic - for each model:

- The CNN outputs a softmax probability vector

- The predicted class is determined using argmax

- Confidence is calculated as the highest softmax probability

- The numerical class index is mapped to a human-readable label

Each model returns:

- prediction: predicted class name

- confidence: probability score

### Response Construction and Response Output
After prediction and calculation is predicted, responses is sent back to the Flask API.

Response Construction:
- The image is encoded into Base64
- A structured JSON response is returned to the front end containing

    - Choice
    - Prediction
    - Confidence
    - image (base64)

The JSON response is then shown in the frontend and formatted properly to show the output to the user.

# Demo and Running the Code

## Directory and Package installation/setup

Directory Setup:

``` git
git clone https://github.com/SlyIshan27/ML-Image-Classification-App.git
cd ML-Image-Classification
```
Requirements/Package setup (For tensorflow/keras, flask, Pillow, etc):

```
pip install -r MLBackend/requirements.txt
```
or
```
cd MLBackend
pip install -r requirements.txt
```
## Running App
In one terminal run this command for the frontend:
```
npm start
```
In another terminal run these commands for the backend:
```
cd MLBackend
python3 postRequest.py
```

## Demo
