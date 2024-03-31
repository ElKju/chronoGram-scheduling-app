#!/bin/bash

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Move into the OneOnOne directory
cd OneOnOne

# Install required packages
pip install -r requirements.txt

# Run Django migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django development server
python manage.py runserver