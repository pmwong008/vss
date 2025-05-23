const Newbee = require('../model/Newbee');
const mongoose = require('mongoose'); // Import the Mongoose library
const { decryptPhone } = require('../utils/phoneCrypt'); // Import the decryption utility


const allBees = async (req, res) => {
    try {
        console.log('All Bees route hit!'); // Debugging

        const beesFromDB = await Newbee.find({ Archived: false });
        if (!beesFromDB) return res.status(204).json({ 'message': 'No newbees found.' });

        console.log("beesFromDB:", Array.isArray(beesFromDB), beesFromDB);
        // Check if the data is an array
        console.log("First bee:", beesFromDB[0]);

        beesFromDB.forEach(bee => {
            console.log(`Decrypting phone for ${bee.name}:`, decryptPhone(bee.phone.encryptedData, bee.phone.iv));
        }); 

        /* beesFromDB.forEach(bee => {
            console.log(`Name: ${bee.name}, Phone: ${decryptPhone(bee.phone.encryptedData, bee.phone.iv)}`);
        });  */
        

        const bees = beesFromDB.map(bee => ({
            id: bee._id,
            name: bee.name,
            phone: bee.phone?.encryptedData && bee.phone?.iv
                ? decryptPhone(bee.phone.encryptedData, bee.phone.iv)
                : "No phone data"
        }));
        
        // res.json(bees);
        res.render('newbees', { bees, title: 'New Bees' });

    } catch {
        console.error('Error fetching newbees:', error);
        res.status(500).json({ message: 'Server error occurred' });
    } 
}

const archiveBee = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from request parameters
        if (!id) return res.status(400).json({ message: 'NewBee ID required' });

        // Fetch newbee details before remove from list
        const beeToArchive = await Newbee.findById(id);
        if (!beeToArchive) {
            return res.status(404).json({ message: `NewBee ID ${id} not found` });
        }

        const tempBee = beeToArchive.name; // Store username before deletion
        
        const result = await Newbee.findByIdAndUpdate(id, { Archived: true });
        if (!result) {
            return res.status(404).json({ message: `NewBee ID ${id} not found` });
        }

        // Fetch updated newbee list after deletion
        // res.render('confirmDeleteNewBee', { deletedNewBee, message: `NewBee '${deletedNewBee}' was deleted successfully` });
        // res.json({ message: `NewBee '${ archiveNewbee }' was archived successfully` });
        res.json({ success: true });
        
    } catch {
        console.error('Error deleting newbee:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
}

module.exports = {
    allBees,
    archiveBee
    // unarchiveBee
}