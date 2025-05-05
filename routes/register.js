const express = require('express');
const router = express.Router();
const newBee = require('../model/Newbee');
const registerController = require('../controllers/registerController');
// const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

/* router.get('/', (req, res) => {
    res.render('register', { title: 'Add New VSS User' });
});

router.post('/', registerController.handleNewUser); */


router.get('/', verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    const bees = await newBee.find({ Archived: false });
    if (!bees) return res.status(204).json({ 'message': 'No newbees found.' });
    console.log('Type of bees:', typeof bees);
    res.render('register', { bees, title: 'Add New User' });
});

router.post('/', verifyRoles(ROLES_LIST.Admin), registerController.handleNewUser);

module.exports = router;