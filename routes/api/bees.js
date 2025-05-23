const express = require('express');
const router = express.Router();
const beesController = require('../../controllers/beesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/allBees', (verifyRoles(ROLES_LIST.Admin), beesController.allBees));
router.post('/archiveBee/:id', (verifyRoles(ROLES_LIST.Admin), beesController.archiveBee));

// router.post('/unarchiveBee/:id', (verifyRoles(ROLES_LIST.Admin), beesController.unarchiveBee));

module.exports = router;