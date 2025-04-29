const express = require('express');
const router = express.Router();

const pigeonsController = require('../controllers/pigeonsController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
// const verifyJWT = require('../middleware/verifyJWT');
// const { handleRefreshToken } = require('../controllers/refreshTokenController');
const calendarController = require('../controllers/calendarController');
const usersController = require('../controllers/usersController');
const { handleNewUser } = require('../controllers/registerController');
const { handleRefreshToken } = require('../controllers/refreshTokenController');

// Route to load the adminCalendar, and handle the calendar functionality
router.route('/calendar')
    .get( (req, res) => {
        const username = req.cookies?.username;
        // const username = req.user.username;

    res.render('adminCalendar', { username, title: 'Admin Calendar' });
    })
    .post( verifyRoles(ROLES_LIST.Admin), calendarController.adminCalendar);

// Route to serve the admin dashboard
router.get('/', verifyRoles(ROLES_LIST.Admin), (req, res) => {
    res.render('adminDashboard', { title: 'Admin Dashboard' });
});

// Route to add or remove users
router.route('/aboutUsers')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin), handleNewUser);

// Use ID parameters to get or remove a user
router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);



module.exports = router;