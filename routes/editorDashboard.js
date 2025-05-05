const express = require('express');
const router = express.Router();
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');
const getPreview = require('../utils/getPreview');
const bulletinController = require('../controllers/bulletinController');
const Bulletin = require('../model/Bulletin');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), async (req, res) => {
        try {
            const username = req.cookies.username;
            if (!username) {
                return res.status(401).render('error', { message: "Unauthorized" });
            }
            
            const bulletins = await Bulletin.find({}).sort({ createdAt: -1 }).limit(5).exec(); // Fetch the latest 5 bulletins
            console.log('This is the bulletins freshly fetched:', bulletins);

            if (!bulletins) {
                return res.status(404).render('error', { message: "No bulletins found" });
            }

            const previewedBulletins = bulletins.map( b => ({
                _id: b._id,  // Preserve ID for alignment
                textField: getPreview( b.textField, 7 ), // Generate preview
                createdAt: b.createdAt // Include createdAt for sorting
            }));
 
            res.render('editorDashboard', { title: 'Editor Dashboard', username, previewedBulletins });

        } catch (error) {
            console.error("Error while trying to render editor dashboard:", error);
            res.status(500).json({ message: "Error while trying to render editor dashboard" });
        }
    })

    .post(bulletinController.createBulletin);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), bulletinController.getBulletinById);

module.exports = router;