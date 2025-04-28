const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.get('/', (req, res) => {
    res.render('register', { title: 'Add New VSS User' });
});

router.post('/', verifyRoles(ROLES_LIST.Admin), registerController.handleNewUser);

module.exports = router;