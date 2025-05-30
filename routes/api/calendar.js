const express = require('express');
const router = express.Router();
const calendarController = require('../../controllers/calendarController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');


router.get('/', verifyJWT, verifyRoles(ROLES_LIST.User), calendarController.showCalendar);
    

module.exports = router;
