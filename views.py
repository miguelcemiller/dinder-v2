from flask import request, render_template, jsonify
from app import app, db
from models import Users
from utils import *

@app.route('/')
def index():
    return render_template('index.html')