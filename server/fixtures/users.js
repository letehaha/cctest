var dbConfig = require('../config/database.config.js');
var mongoose = require('mongoose');

User = require('../src/models/user');
_Event = require('../src/models/event');

mongoose.connect(dbConfig.url, {});

var user = {
  name: 'test',
  password: 'test',
  events: [
    { _id: 0, title: 'Тестовая запись', start: 10, duration: 50 }
  ]
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
