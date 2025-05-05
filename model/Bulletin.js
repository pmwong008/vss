const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
  textField: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  } 

});

module.exports = mongoose.model('Bulletin', bulletinSchema);