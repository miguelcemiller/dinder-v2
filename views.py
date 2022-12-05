from flask import request, render_template, jsonify
from app import app, db
from models import Users
from utils import *
import json
from glob import glob


@app.route('/')
def login_temp():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']


        user = Users.query.filter_by(username=username).first()
        if user is None:
            return {
                'isValid': False
            }

        if password == user.password:
            # login
            return {
                'username': user.username,
                'isValid': True
            }
        else:
            # wrong username / password
            return {
                'isValid': False
            }

@app.route('/register')
def register():
    return render_template('register.html')

# /home/<username>
@app.route('/home/<username>', methods=['GET'])
def home(username):
    if request.method == "GET":
        user = Users.query.filter_by(username=username).first()
        return render_template('home.html', user=user)

# /home/<username>/<breed_filter>/<location_filter>
@app.route('/home/<username>/<breed_filter>/<location_filter>', methods=['GET'])
def home_filtered(username, breed_filter, location_filter):
    if request.method == 'GET':
        user = Users.query.filter_by(username=username).first()
        breed = user.breed
        gender = user.gender
        location = user.location

        if breed_filter == 'Any Breed' and location_filter == 'Any Location':
            dogs = Users.query.filter(Users.gender != gender, Users.username != username).all()
        if breed_filter == 'Any Breed' and location_filter == 'Same Location':
            dogs = Users.query.filter(Users.gender != gender, Users.username != username, Users.location == location).all()  
        if breed_filter == 'Any Breed' and location_filter == 'Other Location':
            dogs = Users.query.filter(Users.gender != gender, Users.username != username, Users.location != location).all() 

        if breed_filter == 'Same Breed' and location_filter == 'Any Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed == breed).all()
        if breed_filter == 'Same Breed' and location_filter == 'Same Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed == breed,
                Users.location == location).all()
        if breed_filter == 'Same Breed' and location_filter == 'Other Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed == breed,
                Users.location != location).all()

        if breed_filter == 'Cross Breed' and location_filter == 'Any Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed != breed).all()
        if breed_filter == 'Cross Breed' and location_filter == 'Same Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed != breed,
                Users.location == location).all()
        if breed_filter == 'Cross Breed' and location_filter == 'Other Location':
            dogs = Users.query.filter(
                Users.gender != gender, 
                Users.username != username,
                Users.breed != breed,
                Users.location != location).all()

        dogs_list = []
        for dog in dogs:
            dogs_list.append(dog.as_dict())

        return dogs_list

# /dog-clicked/<username>
@app.route('/dog-clicked/<username>', methods=['GET'])
def dog_clicked_json(username):
    if request.method == 'GET':
        user = Users.query.filter_by(username=username).first()
        dogs_clicked = user.dogs_clicked
        if dogs_clicked == '':
            # empty
            temp_list = []
            temp_list_dump = json.dumps(temp_list)

            user.dogs_clicked = temp_list_dump
            db.session.commit()

            return temp_list
        else: 
            # not empty
            temp_list_2 = json.loads(user.dogs_clicked)

            return temp_list_2

# /dog-clicked/<username>/<add_username>
@app.route('/dog-clicked/<username>/<add_username>', methods=['POST'])
def dog_clicked(username, add_username):
    if request.method == 'POST':
        user = Users.query.filter_by(username=username).first()
        dogs_clicked = user.dogs_clicked
        if dogs_clicked == '':
            # empty
            temp_list = []
            temp_list.append(add_username)
            temp_list_dump = json.dumps(temp_list)

            user.dogs_clicked = temp_list_dump
            db.session.commit()
        else: 
            # not empty
            temp_list_2 = json.loads(user.dogs_clicked)
            temp_list_2.append(add_username)
            temp_list_2_dump = json.dumps(temp_list_2)

            user.dogs_clicked = temp_list_2_dump
            db.session.commit()

        return {
            'success': 'success'
        }

# /user-data/<username>
@app.route('/user-data/<username>', methods=['GET'])
def user_data(username):
    if request.method == "GET":
        user = Users.query.filter_by(username=username).first()

        return user.as_dict()
        

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == "POST":
        classifier = request.form['classifier']
        image = request.files['image']
        prediction = ''
        image_filename = request.form['imageFilename']

        if image_filename == "":
            # Save image
            image_filename = save_image(image)

        # Prediction (Breed || Coat Color)
        prediction = predict(image_filename, classifier)

        return {
            'prediction': prediction,
            'imageFilename': image_filename
        }

@app.route('/save', methods=['POST'])
def save():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        breed = request.form['breed']
        coat_color = request.form['coatColor']
        type = request.form['type']
        gender = request.form['gender']
        location = request.form['location']
        year = request.form['year']
        month = request.form['month']
        image_filename = request.form['imageFilename']

        user = Users(
            username=username, 
            password=password,
            name=name,
            breed=breed,
            coat_color=coat_color,
            type=type,
            gender=gender,
            location=location,
            year=year,
            month=month,
            image_filename=image_filename,
            dogs_clicked='')

        db.session.add(user)
        db.session.commit()
        
        return {
            'username': username,
            'password': password,
            'imageFilename': image_filename
        }


# offsprings images path
@app.route('/offsprings-images-paths/<user_breed>/<user_coat_color>/<dog_breed>/<dog_coat_color>', methods=['GET'])
def offsprings_images_paths(user_breed, user_coat_color, dog_breed, dog_coat_color):
    folder = user_breed.lower() + '-' + user_coat_color.lower() + '-' + dog_breed.lower() + '-' + dog_coat_color.lower()
    print("Folder name:", folder)
    folder_path = join(dirname(realpath(__file__)), 'static/images/offsprings/') + folder
    offsprings_images_whole_paths = glob(folder_path+'/*')

    offsprings_images_filenames = [os.path.basename(x) for x in offsprings_images_whole_paths]

    offsprings_images_paths = []
    for x in offsprings_images_filenames:
        path = '/static/images/offsprings/'+folder+'/'+x 
        offsprings_images_paths.append(path)

    return {
        'offsprings_images_paths': offsprings_images_paths
    }