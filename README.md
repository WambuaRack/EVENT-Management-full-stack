Events Management Web App

A full-stack web application for managing events, including role-based dashboards for Users, Managers, and Admins, JWT authentication, and event visibility control.

Table of Contents

Features

Tech Stack

Getting Started

Folder Structure

User Credentials

API Endpoints

Running the Project

License

Features

User Dashboard: View public events and RSVP.

Manager Dashboard: Create, edit, delete events

Admin Dashboard: Manage users, view all events 

Role-Based Access Control: Users, Managers, and Admins have separate views.


Event Visibility: Events can be public or private.

JWT Authentication: Secure login with role-based claims.

Tech Stack

Frontend: React, Axios, Context API

Backend: Django, Django REST Framework, Simple JWT

Database: SQLite (default, can be changed to PostgreSQL)

Authentication: JWT Tokens



User Credentials
Role	Username	Password
Admin	wambua	1234567890
Manager	red   	1234567890
User	blue	1234567890

Note: You can create additional users through the Admin Dashboard or via API.

API Endpoints

User Registration: POST /api/register/

JWT Token: POST /api/token/

Events: GET /api/events/, POST /api/events/, PATCH/PUT/DELETE /api/events/<id>/


User Management (Admin): GET /api/users/, POST /api/users/, PATCH/DELETE /api/users/<id>/

Getting Started
Prerequisites

Node.js & npm

Python 3.10+

pip or pipenv/venv

Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

pip install -r requirements.txt


Apply migrations:

python manage.py makemigrations
python manage.py migrate




Start the backend server:

python manage.py runserver

Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the development server:

npm start


The frontend will run on http://localhost:3000 and connect to the backend API at http://127.0.0.1:8000/.

Notes

To maintain separate sessions for different roles in multiple tabs, the app uses sessionStorage.

JWT tokens are stored in localStorage; ensure they are valid before performing any actions.

If you get CORS issues, install django-cors-headers and configure it in settings.py.

License

This project is MIT Licensed. You are free to use and modify it.

please follow me in github, wambuarack, Asante.
