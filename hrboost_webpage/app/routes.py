from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Miguel'}
    return render_template('index.html', title='Home', user=user)

@app.route('/map')
def map():
    user = {'username': 'Miguel'}
    return render_template('map.html', title='Map', user=user)

@app.route('/about')
def about():
    return render_template('about.html', title='About')

@app.route('/machinelearning')
def machinelearning():
    return render_template('machinelearning.html', title='Machine Learning')

@app.route('/forms')
def forms():
    return render_template('forms.html', title='Employee Form')