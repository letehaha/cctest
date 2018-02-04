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
    { id: 0, start: 0, duration: 15, title: 'Lorem ipsum dolor sit amet.', left: '0' }, // full
    { id: 1, start: 25, duration: 30, title: 'Lorem, ipsum.', left: '1' }, // left
    { id: 2, start: 30, duration: 30, title: 'Lorem ipsum dolor sit.', left: '2' }, // right
    { id: 3, start: 60, duration: 15, title: 'Lorem.', left: '0' },
    { id: 4, start: 100, duration: 15, title: 'Lorem ipsum dolor sit amet, consectetur adipisicing.', left: '0' },
    { id: 5, start: 180, duration: 90, title: 'Lorem ipsum dolor sit amet, consectetur.', left: '0' },
    { id: 6, start: 360, duration: 30, title: 'Lorem, ipsum.', left: '1' },
    { id: 7, start: 370, duration: 45, title: 'Lorem, ipsum.', left: '2' },
    { id: 8, start: 405, duration: 30, title: 'Lorem ipsum dolor sit.', left: '1' }
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
