var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const path = require('path');
const Newbee = require('../model/Newbee');
const {encryptPhone} = require('../utils/phoneCrypt');
const Bulletin = require('../model/Bulletin');

/* GET home page. */
router.get('^/$|/index(.html)?', async (req, res) => { // res.render('index', { title: 'VSS' });
	let coverMessage = await Bulletin.findOne({ isCoverMessage: true }).sort({ createdAt: -1 });
	if (!coverMessage) {
		coverMessage = {
			textField: 'Welcome to VSS! Please check back later for updates.',
			createdAt: new Date()
		};
		res.render('index.ejs', { coverMessage });
	} else {
	res.render('index.ejs', { coverMessage });
	}
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
