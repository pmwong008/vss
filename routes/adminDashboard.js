const express = require('express');
const router = express.Router();

const pigeonsController = require('../controllers/pigeonsController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT');
const { handleRefreshToken } = require('../controllers/refreshTokenController');
const calendarController = require('../controllers/calendarController');

// Route to admin login
router.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login' });
});
// Route to serve the admin dashboard
router.get('/', verifyJWT, verifyRoles(ROLES_LIST.Admin), (req, res) => {
    res.render('adminDashboard', { title: 'Admin Dashboard' });
});
// Route to serve the calendar
router.get('/calendar', verifyJWT, verifyRoles(ROLES_LIST.Admin), calendarController.showAdminCalendar);


module.exports = router;