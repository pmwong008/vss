const mongoose = require('mongoose');

const pigeonSchema = new mongoose.Schema({
  rDate: {
    type: Date,
    required: true
  },
  wkDay: {
    type: String,
    required: true
  },
  vName: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  } 
});

module.exports = mongoose.model('Pigeon', pigeonSchema);