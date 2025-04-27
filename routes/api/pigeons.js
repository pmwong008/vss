const express = require('express');
const router = express.Router();
const pigeonsController = require('../../controllers/pigeonsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const { handleRefreshToken } = require('../../controllers/refreshTokenController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/form')
    .get(pigeonsController.servePigeonForm)
    .post(pigeonsController.createPigeon)
    
// router.get('/getUserPigeons', handleRefreshToken, pigeonsController.getUserPigeons);    
router.get('/getUserPigeons', pigeonsController.getUserPigeons);    

/* router.route('/:id')
    .get(pigeonsController.getPigeon); */

/* router.get('/form', (req, res) => {
    const username = req.cookies?.username;
    res.render('pigeonForm', { vName: username, title: 'Pigeon Form' });

}).post('/form', pigeonsController.createPigeon);
*/



module.exports = router;