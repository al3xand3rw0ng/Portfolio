# HeapOverflow

**HeapOverflow** is a platform where users can ask questions, write answers, and comment on posts. In addition, users can make a profile with information about them such as their name and bio. They also have the option to add a profile picture. They can adjust settings such as what color mode they want the site to be. With the addition of the social page, users can send friend requests to other users, have them appear on the page, and chat with their friends.
 
HeapOverflow was built for Northeastern's Fall 2024 Fundamentals of Software Engineering Class. You can view our deployed application at https://fall24-project-fall24-team-project-group-rrka.onrender.com/. 

![Class Diagram](final-class-diagram.png)

Above is a UML diagram of the database model for our application where you can see where we have added new collections in pink to pre-existing collections in blue. However, it is important to note that some of the collections have had their attributes modified or had new attributes added for our application and ease of access. 
 
## Running HeapOverflow locally

**1. Install Node.js v20**
- Download and install Node.js version 20 from the official website. After installation, verify the installation by running the following commands in your terminal:
```
node -v
npm -v
```
- These should return the installed Node.js and npm versions, confirming that the installation was successful.

**2. Install Visual Studio Code (VSCode)**
- Download and install the free Visual Studio Code editor to manage and edit your project files.

**3. Install MongoDB Community Edition**
- Install MongoDB by following the instructions provided in the official MongoDB documentation. This will set up the database for local development.

**4. Create ENV Variables**
- Create a file called `.env` in `./client`. In `./client/.env`, ensure the following lines:
```
REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY="AIzaSyB7mO36WUIDvT4JnaY2t8WoTd6uOCLfyqk"
REACT_APP_FIREBASE_AUTH_DOMAIN="swe-group-104-project.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="swe-group-104-project"
REACT_APP_FIREBASE_STORAGE_BUCKET="swe-group-104-project.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="807236687440"
REACT_APP_FIREBASE_APP_ID="1:807236687440:web:1670fe4aa51d29f434a355"
REACT_APP_FIREBASE_MEASUREMENT_ID="G-NRX3BSE789"
```

**5. Set Up the Project**
- Once Visual Studio Code is installed, open your downloaded project repository. Then, execute the following commands in your terminal to install the necessary dependencies for the client, server, and testing:
- Navigate to the client directory and install dependencies:
```
cd client/ 
npm install
```
- Navigate to the server directory and install dependencies:
```
cd ../server
npm install
```
- Navigate to the testing directory and install dependencies:
```
cd ../testing
npm install
```

**6. Start the Client**
- To start the client, run the following command in the client directory:
	`npm run start`
- This will start the client on http://localhost:3000.

**7. Start the Server**
- To start the server, run the following command in the server directory:
	`npx ts-node server.ts`
- This will start the server on https://localhost:8000.

**8. Run Tests**
- To run tests, navigate to the server directory and run the following command:
	`npm run test`
