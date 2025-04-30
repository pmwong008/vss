const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers);
    

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser)


router.post('/deleteUser',(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser));
router.post('/updateUserRole', (verifyRoles(ROLES_LIST.Admin), usersController.updateUserRole));
router.post('/updateUserRemarks', (verifyRoles(ROLES_LIST.Admin), usersController.updateUserRemarks));



module.exports = router;