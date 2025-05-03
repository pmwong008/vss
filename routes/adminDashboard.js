const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const pigeonsController = require('../controllers/pigeonsController');
const Pigeon = require('../model/Pigeon');

// Route to serve the admin dashboard
router.get('/', verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    const today = new Date();
    const nextWeek = new Date();
    console.log("Admin Dashboard route hit!");
    console.log("today's date is:", today); // Debug dates
    console.log("today's type is:", typeof today); // Debug dates

    try {
        nextWeek.setDate(today.getDate() + 7);

        // Fetch Pigeons within the next 7 days
        const pigeons = await Pigeon.find({ 
            rDate: { 
                $gte: today, 
                $lte: nextWeek 
            } 
        }).sort({ rDate: 1 }); // Sort by rDate in ascending order
        
        if (!pigeons || pigeons.length === 0) {
            return res.render('adminDashboard', { title: 'Admin Dashboard', pigeons: [], message: "No scheduled sessions in the next 7 days." });
        }
        res.render('adminDashboard', { title: 'Admin Dashboard', pigeons }); // Pass Pigeons to the view
    } catch (error) {
        console.error("Error while trying to render admin dashboard:", error);
        res.status(500).json({ message: "Error while trying to render admin dashboard" });
    }
});

router.post('/getPigeonsByDateRange', verifyRoles(ROLES_LIST.Admin), pigeonsController.getPigeonsByDateRange);

module.exports = router;