const express = require('express');
const router = express.Router();
const pigeonsController = require('../../controllers/pigeonsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const { handleRefreshToken } = require('../../controllers/refreshTokenController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), pigeonsController.createPigeon)

    

router.route('/form')
    .get(pigeonsController.servePigeonForm)
    
    
// router.get('/getUserPigeons', handleRefreshToken, pigeonsController.getUserPigeons);    
router.get('/getUserPigeons', verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), pigeonsController.getUserPigeons);    

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), pigeonsController.getPigeon)
    
router.route('/delete/:id')
    
    .delete(verifyRoles(ROLES_LIST.User), pigeonsController.deletePigeon)

/* router.get('/form', (req, res) => {
    const username = req.cookies?.username;
    res.render('pigeonForm', { vName: username, title: 'Pigeon Form' });

}).post('/form', pigeonsController.createPigeon);
*/

module.exports = router;