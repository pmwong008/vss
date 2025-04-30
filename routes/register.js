const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

/* router.get('/', (req, res) => {
    res.render('register', { title: 'Add New VSS User' });
});

router.post('/', registerController.handleNewUser); */


router.get('/', verifyJWT, verifyRoles(ROLES_LIST.Admin), (req, res) => {
    res.render('register', { title: 'Add New VSS User' });
});

router.post('/', verifyJWT, verifyRoles(ROLES_LIST.Admin), registerController.handleNewUser);

module.exports = router;