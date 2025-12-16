import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.constraints import MaxNorm
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.metrics import Precision, Recall, BinaryAccuracy
import numpy as np
import cv2
import imghdr
from tensorflow.keras.models import load_model
import os
# def removeImages():
#     directory = 'C:\Users\Ishan\.cache\kagglehub\datasets\ryanbadai\clothes-dataset\versions\1'
#     imageExtensions = ['jpeg', 'jpg', 'png', 'bmp']
#     for imageRoot, imageDirectories, imageFiles in os.walk(directory):
#         for image in imageFiles:
#             imagePath = os.path.join(imageRoot, image)
#             try:
#                 img = cv2.imread(imagePath)
#                 tip = imghdr.what(imagePath)
#                 if tip not in imageExtensions: 
#                     print('Image not in ext list {}'.format(imagePath))
#                     os.remove(imagePath)
#             except Exception as e:
#                 print("There was an issue with this image: {}" .format(imagePath))
#                 # os.remove(imagePath)
def loadData():
    data = tf.keras.utils.image_dataset_from_directory('foodDataset')
    dataIterator = data.as_numpy_iterator()
    classNames = data.class_names
    print(classNames)
    images, labels = next(dataIterator)
    figure, axis = plt.subplots(nrows=2, ncols=5, figsize=(20,20))
    axis = axis.flatten()
    for index in range(10):
        axis[index].imshow(images[index].astype("uint8"))
        axis[index].title.set_text(classNames[labels[index]])
        # axis[index].axis("off")
    plt.show()
    
    data = data.map(lambda x, y: (x /255.0, y))
    datasetSize = len(data)
    trainSize = int(datasetSize * 0.7)
    valSize = int(datasetSize *0.2)
    
    trainDataset = data.take(trainSize)
    valDataset = data.skip(trainSize).take(valSize)
    testDataset = data.skip(trainSize + valSize)
    
    return trainDataset, valDataset, testDataset

def buildModel():
    model = Sequential()
    model.add(Conv2D(16, (3,3), activation='relu', input_shape=(256,256,3)))
    model.add(MaxPooling2D())
    
    model.add(Conv2D(32, (3,3), activation='relu'))
    model.add(MaxPooling2D())
    
    model.add(Conv2D(64, (3,3), activation='relu'))
    model.add(MaxPooling2D())
    
    model.add(Flatten())
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    
    model.add(Dense(2, activation='softmax'))
    model.compile('adam', loss=tf.losses.SparseCategoricalCrossentropy(), metrics=['accuracy'])
    
    model.summary()
    
    return model
def trainModel(trainDatset, validationData, model):
    logdir='logs'
    tensorBoardCallBack = tf.keras.callbacks.TensorBoard(log_dir=logdir)
    hist = model.fit(trainDatset, epochs=20, validation_data=validationData, callbacks=[tensorBoardCallBack])
    return hist
def plotLoss(hist):
    figure = plt.figure()
    plt.plot(hist.history['loss'], color='red', label='loss')
    plt.plot(hist.history['val_loss'], color='green', label='validation_loss')
    figure.suptitle('Loss', fontsize=25)
    plt.legend(loc="upper right")
    plt.show()

def plotAccuracy(hist):
    figure = plt.figure()
    plt.plot(hist.history['accuracy'], color='blue', label='accuracy')
    plt.plot(hist.history['val_accuracy'], color='green', label='validation_accuracy')
    figure.suptitle('Accuracy', fontsize=25)
    plt.legend(loc="upper right")
    plt.show()

if __name__ == "__main__":
    train, val, test = loadData()
    # print(train)
    model = buildModel()
    hist = trainModel(train, val, model)
    model.save(os.path.join('models', 'foodClassificationV1.h5'))
    plotLoss(hist)
    plotAccuracy(hist)
    
    
