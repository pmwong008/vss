const express = require('express');
const router = express.Router();
const pigeonsController = require('../../controllers/pigeonsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

/* router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),pigeonsController.getAllPigeons)
    .post(verifyRoles(ROLES_LIST.User), pigeonsController.createPigeon)
    .delete(verifyRoles(ROLES_LIST.Admin),pigeonsController.deletePigeon);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin),pigeonsController.getPigeon); */

router.get('/form', (req, res) => {
    const username = req.cookies?.username;
    res.render('pigeonForm', { vName: username, title: 'Pigeon Form' });

}).post('/form', pigeonsController.createPigeon);

/* router.get('/form', verifyRoles(ROLES_LIST.User), (req, res) => {
    res.render('pigeonForm', { vName: req.user.firstname, title: 'Pigeon Form' });
}); */
module.exports = router;