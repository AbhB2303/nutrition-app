# nutrition-app

## Setup Instructions

The following are basic instructions on how to setup your local environment for the application designed for the final project in SOEN 357. If you would like to skip the steps for setup and directly see the website, you can check out the cloud deployment here: <https://nutrition-app-two.vercel.app/>. Please note that the cloud instance for frontend and backend are on a minimal configuration and you may experience slow loading/response times.

### Clone

If you haven't already, clone the repository from github to a local folder. Project Clone HTTPS: <https://github.com/AbhB2303/nutrition-app.git>

### Frontend Setup

1. Install Node.js from the following download page: <https://nodejs.org/en/download>
2. From your terminal, navigate to the frontend folder in NUTRITION-APP/frontend/
3. Run the following command to download all frontend packages: npm install
4. Create a .env file in the frontend folder and add the following information:
    REACT_APP_API_SERVER_URL=<http://localhost:4200>
    REACT_APP_AUTH0_DOMAIN=dev-xh3w1gnqaw1opiux.us.auth0.com
    REACT_APP_AUTH0_CLIENT_ID=u46YuFmIihb5aPfgw75kUcVCK0SOMzWr
    REACT_APP_AUTH0_CALLBACK_URL=<http://localhost:3000/home>
    REACT_APP_AUTH0_AUDIENCE=<https://NutritionAPI/>
5. Once all packages have successfully installed, the frontend server should start serving at localhost:3000

### Backend Setup

1. In the root of the repo folder, create a virtual environment for Flask: <https://flask.palletsprojects.com/en/2.2.x/installation/>
2. Activate the virtual environment in a new terminal
3. In the same terminal, navigate to the backend folder aka NUTRITION-APP/backend/
4. Run the following command to install all python packages: pip install -r requirements.txt
    - Note: to run pip, you will need to have it installed. If you don't have python and pip, you can install them at the following links:
        - Python: <https://www.python.org/downloads/>
        - Pip: <https://pip.pypa.io/en/stable/installation/>
5. Add a .env file in the backend folder and add the following information:
    CLIENT_ORIGIN_URL=<http://localhost:3000>
    MONGO_URI=mongodb://localhost:27017
    AUTH0_DOMAIN=dev-xh3w1gnqaw1opiux.us.auth0.com
    AUTH0_AUDIENCE=<https://NutritionAPI/>
6. Download MongoDB Community, mongoshell, and MongoDBCompass from the mongodb products tab: <https://www.mongodb.com/>
7. Start MongoDB Compass and connect to your local connection
8. create a new database called: NutritionDB
9. Download the following json based data: <https://drive.google.com/drive/folders/1idai5sUbA2-BMjeVXxB0gkgOEGlgClMy?usp=drive_link>
10. Import each json file as a collection (with the same name as the file) into the NutritionDB database
11. Run The following command from the backend folder in a terminal: flask --app main.py run --debug --port=4200 --debug
12. The backend server should now start and begin accepting requests.
