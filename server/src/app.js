const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var dbConfig = require('../config/database.config.js');
var mongoose = require('mongoose');

// models

User = require('./models/user');
_Event = require('./models/event');

mongoose.connect(dbConfig.url, {});

mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

mongoose.connection.once('open', function () {
  console.log("Successfully connected to the database");
});

app.use(cors());

app.get('/calendar', (req, res) => {
  res.send([
    { id: 0, start: 0, duration: 15, title: 'Lorem ipsum dolor sit amet.' },
    { id: 1, start: 25, duration: 30, title: 'Lorem, ipsum.' },
    { id: 2, start: 30, duration: 30, title: 'Lorem ipsum dolor sit.' },
    { id: 3, start: 40, duration: 30, title: 'Lorem ipsum dolor sit.' }
  ]);
});

app.get('/users', (req, res) => {
  User.getUser(function (err, users) {
    if (err) {
      throw err;
    }
    res.json(users);
  });
});

app.post('/user', (req, res) => {
  var user = req.body.body;
  User.addUser(user, function (err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

app.listen(process.env.PORT || 8081);
