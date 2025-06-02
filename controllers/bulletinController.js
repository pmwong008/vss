const Bulletin = require('../model/Bulletin'); // Import the Bulletin model

const createBulletin = async (req, res) => {
    try {

    
    const { textField, submitType } = req.body;
    if (!textField) {
        return res.status(400).json({ 'message': 'Text field is required.' });
    }

    if (submitType === 'cover') {
    
        // Update the existing cover message OR create one if none exists
        /* await Bulletin.findOneAndUpdate(
            { isCoverMessage: true }, // Look for an existing cover message
            { textField, isCoverMessage: true }, // Update the message
            { upsert: true } // Create one if none exists
        ); */
        await Bulletin.create(
            { textField, isCoverMessage: true } // Update the message
        ); 
    } else {
        // Save a regular bulletin entry
        await Bulletin.create(
            { textField, isCoverMessage: false }
        );
    }
      
        // res.status(201).json({ message: 'Bulletin created successfully.', bulletin: newBulletin });
        res.redirect(301, '/editorDashboard'); // Redirect to the editor dashboard after creating the bulletin
    } catch (error) {
        console.error('Error creating bulletin:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const getBulletinById = async (req, res) => {
    const { id } = req.params;
    try {
        const bulletin = await Bulletin.findById(id);
        if (!bulletin) {
            return res.status(404).json({ message: 'Bulletin not found.' });
        }
        res.status(200).json(bulletin);
    } catch (error) {
        console.error('Error fetching bulletin:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    createBulletin,
    getBulletinById
};