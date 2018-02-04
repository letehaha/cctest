# Code&Care test task

### How to start

For successful start this project you need to:

- Install Node.js version 6.10.3 or higher (application was not tested on the versions below)
- Install MongoDB for your platform [here](https://docs.mongodb.com/manual/administration/install-community/)
- Open the terminal in the place where you want to download the project and type next commands:
  - ```git clone https://github.com/letehaha/cctest.git```
  - ```npm i``` inside **client** folder
  - ```npm i``` inside **server** folder
- Open terminal in folder where downloaded MongoDB is located
  - Create new tab/window in terminal
  - Type ```./mongod```
  - Create new tab/window in terminal
  - Type ```mongo```
- In ```cctest/server``` directory type ```npm run fixture``` command to set to database a default data
- In ```cctest/server``` directory type ```npm start``` command for starting a server
- In ```cctest/client``` directory type ```npm run dev``` command for starting a client-side

Now, application is running on ```http://localhost:8080```

For login in application you can enter a default user data (```login: test, password: test```) or create a new user.
___
At the moment, you can't add/remove events from calendar. Also, you can't to export data in JSON. This will be added soon.
