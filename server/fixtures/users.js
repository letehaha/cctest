var dbConfig = require('../config/database.config.js');
var mongoose = require('mongoose');

User = require('../src/models/user');
_Event = require('../src/models/event');

mongoose.connect(dbConfig.url, {});

var user = {
  name: 'test',
  password: 'test',
  events: [
    { start: 0, duration: 100, title: 'Первое событие' },
    { start: 25, duration: 50, title: 'Второе событие' },
    { start: 30, duration: 30, title: 'Третье событие' },
    { start: 270, duration: 35, title: 'Четвертое событие' },
    { start: 300, duration: 35, title: 'Пятое событие' }
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
