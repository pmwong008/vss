const mongoose = require('mongoose');


const newbeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  Archived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Newbee', newbeeSchema);
