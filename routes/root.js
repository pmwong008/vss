var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const path = require('path');
const Newbee = require('../model/Newbee');

/* GET home page. */
router.get('^/$|/index(.html)?', (req, res)  => {
  // res.render('index', { title: 'VSS' });
  res.render('index.ejs', { title: 'VSS' });
});

router.post('/requestToJoin', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Create a new instance of the Newbee model
    const newbee = new Newbee({
      name,
      phone,
    });
    await newbee.save();

  console.log(`Received data: Name - ${name}, Phone - ${phone}`);

  // Respond to the client
  // res.status(200).json({ message: 'Data saved successfully' });
  res.render('requestReceived', { name });

} catch (error) {
  console.error('Error saving data:', error);
  res.status(500).json({ message: 'Internal server error' });
}
});

module.exports = router;
