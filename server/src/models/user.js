var mongoose = require('mongoose');
var eventSchema = require('./event')
var Schema = mongoose.Schema

// user schema

var userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    events: [
      eventSchema
    ]
});

var User = module.exports = mongoose.model('User', userSchema);

// get users

module.exports.getUser = function (callback, limit) {
  User.find(callback).limit(limit);
}

// add user

module.exports.addUser = function (user, callback) {
  User.create(user, callback);
}
