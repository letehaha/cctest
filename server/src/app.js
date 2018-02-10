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

app.post('/calendar', (req, res) => {
  var username = req.body.username;
  User.findOne({ name: username }, function (err, user) {
    if (err) console.error(err)
    if (user)
      res.send(user.events)
  })
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
      console.error(err);
    }
    res.json(user);
  });
});

app.post('/event/add', (req, res) => {
  var user = req.body;
  User.findOneAndUpdate({ name: user.username }, { $push: { events: user.event }}, { new: true }, function (err, user) {
    if (err) console.error(err)
    if (user)
      res.send(user.events)
  })
});

app.post('/event/remove', (req, res) => {
  var event = req.body;
  User.findOneAndUpdate({ name: event.username }, { $pull: { events: { _id: event.removeId } }}, { new: true }, function (err, user) {
    if (err) console.error(err)
    if (user)
      res.send(user.events)
  })
});

app.listen(process.env.PORT || 8081);
