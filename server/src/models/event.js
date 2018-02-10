var mongoose = require('mongoose');
var Schema = mongoose.Schema

// event schema

var eventSchema = new Schema({
    title: String,
    start: Number,
    duration: Number
});

module.exports = eventSchema
