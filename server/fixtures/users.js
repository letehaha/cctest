var dbConfig = require('../config/database.config.js');
var mongoose = require('mongoose');

User = require('../src/models/user');

mongoose.connect(dbConfig.url, {});

var user = {
  name: 'test',
  password: 'test'
}

module.exports.createDb = function () {
  let promise = new Promise(function(resolve, reject) {
    User.addUser(user, function (err, user) {
      resolve()
    });
  })
  promise.then(
    result => {
      mongoose.connection.close()
    },
    error => {
      console.log('something wrong')
    }
  )
}
