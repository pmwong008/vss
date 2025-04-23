const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('login', { title: 'VSS' });
});

router.post('/login', authController.handleLogin);

module.exports = router