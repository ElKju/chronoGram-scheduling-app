#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Move into the OneOnOne directory
cd OneOnOne

# Start the Django development server
python manage.py runserver