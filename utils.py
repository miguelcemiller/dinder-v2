import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from uuid import uuid4
import tensorflow
from keras.preprocessing import image
from glob import glob
import numpy as np
import matplotlib.pyplot as plt
import os
import cv2
from keras.models import load_model

UPLOAD_PATH_DOGS = join(dirname(realpath(__file__)), 'static/images/dog-images')
def save_image(image):
    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_PATH_DOGS, filename))
        image.stream.seek(0)
        return filename

def path_to_tensor(img_path):
    # loads RGB image as PIL.Image.Image type
    img = image.load_img(img_path, target_size=(224, 224))
    # convert PIL.Image.Image type to 3D tensor with shape (224, 224, 3)
    x = image.img_to_array(img)
    # convert 3D tensor to 4D tensor with shape (1, 224, 224, 3) and return 4D tensor
    #print("New Shape ", np.expand_dims(x, axis=0).shape)
    return np.expand_dims(x, axis=0)

def face_detector(image):
    # extract pre-trained face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt.xml")
    
    # save image to temp folder
    UPLOAD_PATH_TEMP = join(dirname(realpath(__file__)), 'static/images/temp')

    print('UPLOAD PATH TEMP', UPLOAD_PATH_TEMP)

    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_PATH_TEMP, filename))

        # reset image before reading again 
        # https://github.com/pallets/werkzeug/issues/1666
        image.stream.seek(0)
        
        image_filename = filename

    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    # load color (BGR) image
    img = cv2.imread(img_path)
    # convert BGR image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # find faces in image
    faces = face_cascade.detectMultiScale(gray)

    # print number of faces detected in the image
    # print('Number of faces detected:', len(faces))

    # get bounding box for each detected face
    for (x,y,w,h) in faces:
        # add bounding box to color image
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        
    # convert BGR image to RGB for plotting
    cv_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # returns "True" if face is detected in image stored at img_path
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray)
    return len(faces) > 0

def predict(image_filename, classifier):
    breed_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/breed-classifier.hdf5'))
    coat_color_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/coat-color-classifier.hdf5'))
    type_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/type-classifier.hdf5'))

    BREEDS = ['Labrador Retriever', 'Pomeranian', 'Poodle', 'Pug', 'Shih-Tzu']
    COAT_COLORS = ['Black', 'Brown', 'Black', 'White', 'Black', 'White', 'Black', 'Fawn', 'Black', 'White']
    TYPES = ['American', 'English', 'Baby Doll', 'Fox Face', 'Standard', 'Toy', 'American', 'European']

    # Image Path
    img_path = join(dirname(realpath(__file__)), 'static/images/dog-images/') + image_filename

    # Reshape
    x = path_to_tensor(img_path)
    x = np.array(x)

    # Breed || Coat Color
    if classifier == 'breed':
        prediction = np.argmax(breed_classifier.predict(x))
        print('Predicted Breed: ',  str(BREEDS[prediction]))
        return str(BREEDS[prediction])
    elif classifier == 'type':
        prediction = np.argmax(type_classifier.predict(x))
        print('Predicted Type: ',  str(TYPES[prediction]))
        return str(TYPES[prediction])
    else:
        prediction = np.argmax(coat_color_classifier.predict(x))
        print('Predicted Coat Color: ',  str(COAT_COLORS[prediction]))
        return str(COAT_COLORS[prediction])

def clear_temp():
    files = glob(join(dirname(realpath(__file__)), 'static/images/temp/*'))
    for f in files:
        os.remove(f)