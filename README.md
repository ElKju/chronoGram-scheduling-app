# chronoGram
<img src="https://github.com/ElKju/csc309_p3/blob/main/P3/chronogram/src/components/mainPage/logo_idea1.png" width="200px" />

chronoGram is a powerful scheduling application that allows users to create and manage calendars, invite others to share their availability via email, and utilize a recommendation algorithm to suggest optimal schedule options. The application also features a contact list for easy updates, account authentication, and user profiles.

## Features

- **Create and Manage Calendars**: Easily create calendars and share them with others.
- **Invite and Collect Availability**: Send email invitations to participants to select their availability.
- **Smart Schedule Suggestions**: chronoGram utilizes a greedy algorithm to provide multiple schedule options.
- **Manage Contacts**: Keep a list of your contacts that can be updated as needed.
- **Account Authentication and Profiles**: Secure login with user profiles.

## Tech Stack

- **Frontend**: HTML, CSS, React, TypeScript
- **Backend**: Django

## Installation

To set up the project locally, follow these steps:

### Backend Setup (Django)

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/ElKju/csc309_p3.git
    cd chronoGram
    ```

2. **Create a Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install Backend Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run Migrations**:
    ```bash
    python manage.py migrate
    ```

5. **Start the Django Server**:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup (React)

1. **Navigate to the Frontend Directory**:
    ```bash
    cd frontend
    ```

2. **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

3. **Start the React Server**:
    ```bash
    npm start
    ```

## Usage

1. **Create an Account**: Register with your email to create an account.
2. **Set Up Your Calendar**: Create a new calendar and invite others to participate.
3. **Collect Availability**: Send out invitations via email and collect availability.
4. **View Schedule Suggestions**: Receive recommended schedule options based on the availability of participants.
5. **Manage Contacts**: Update your contact list as needed.
6. **User Profiles**: Customize and manage your user profile.
