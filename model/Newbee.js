const mongoose = require('mongoose');


const newbeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model('Newbee', newbeeSchema);
