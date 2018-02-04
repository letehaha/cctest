var mongoose = require('mongoose');

// user schema

var userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
});

var User = module.exports = mongoose.model('User', userSchema);

// get users

module.exports.getUser = function (callback, limit) {
  User.find(callback).limit(limit);
}

// get user

module.exports.addUser = function (user, callback) {
  User.create(user, callback);
}
