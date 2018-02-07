var mongoose = require('mongoose');
var Schema = mongoose.Schema

// event schema

var eventSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    start: Number,
    duration: Number
});

module.exports = eventSchema

var _Event = mongoose.model('Event', eventSchema)

module.exports.addEvent = function (event, callback) {
  _Event.create(event, callback);
}
