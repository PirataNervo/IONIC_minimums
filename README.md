# Readme
The second exam for Applications Engineering class.
Contains:
1) basic express NodeJS server with a very simple API which allows the creation of subjects, students and enrolling students in the subjects.
2) Ionic mobile app

server -> API
client -> mobile app

You need to run 'npm install'.

To add classes just make a POST request to serverip:3000/api/subjects with the 'name' parameters specified.

To use the mobile app apk (Android), you may need to setup the server on a live server (the emulator may not be able to access the computer's localhost). You can configure the ApiData service to change the URL of the API in the /client/www/js/app.js file.