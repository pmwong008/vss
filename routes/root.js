var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const path = require('path');
const Newbee = require('../model/Newbee');
const {encryptPhone} = require('../utils/phoneCrypt');

/* GET home page. */
router.get('^/$|/index(.html)?', (req, res) => { // res.render('index', { title: 'VSS' });
	
	res.render('index.ejs', {title: 'VSS'});
});

router.route('/requestToJoin')
  .get((req, res) => {
	  res.render('requestToJoin.ejs', {title: 'VSS'});
  })
  .post(async (req, res) => {
	try {
		const { name, phone } = req.body;

		if (!name || !phone) {
			return res.status(400).json({message: 'Name and phone are required'});
		}

		const encryptedData = encryptPhone(phone);
		const bee = new Newbee({
			name,
			phone: {
				encryptedData: encryptedData.encryptedData,
				iv: encryptedData.iv
			}
		});

		await bee.save();

		console.log("NewBee saved:", bee);
		console.log(`Received data: Name - ${name}, Phone - ${phone}`);

		res.render('requestReceived', {name});

	} catch (error) {
		console.error('Error saving data:', error);
		res.status(500).json({message: 'Internal server error'});
	}
});

module.exports = router;
