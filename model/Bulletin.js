const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
  textField: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  isCoverMessage: { 
    type: Boolean, 
    default: false 
  } // New field to differentiate messages

});

module.exports = mongoose.model('Bulletin', bulletinSchema);