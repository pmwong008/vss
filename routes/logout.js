const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, logoutController.handleLogout);

module.exports = router;