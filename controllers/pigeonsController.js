const Pigeon = require('../model/Pigeon');

const servePigeonForm = async (req, res) => {
    const username = req.cookies?.username;
    res.render('pigeonForm', { vName: username, title: 'Pigeon Form' });
}

const getAllPigeons = async (req, res) => {
    const pigeons = await Pigeon.find();
    if (!pigeons) return res.status(204).json({ 'message': 'No pigeons found.' });
    res.json(pigeons);
}

const getUserPigeons = async (req, res) => {
	
    try {
		console.log("Get User Pigeons route hit!"); 
		console.log("Query Parameters:", req.query); // Debug query parameters
        const username = req.query?.username;// Check for valid username
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ message: "Invalid username provided." });
        }
		console.log("Username from query:", username); // Debug username
		const pigeons = await Pigeon.find({ vName: username }).exec();

		if (!pigeons || pigeons.length === 0) {
			return res.status(204).json({ 'message': 'No pigeons found.' });
		}

		res.json(pigeons);
	
	} catch (error) {
		console.error("Error while trying to find pigeons:", error);
		return res.status(500).json({ message: "Error while trying to find pigeons" });
	}
    
}

const createPigeon = async (req, res) => {
	
	console.log('Request Body:', req.body); // Log incoming data
    try {
		const username = req.cookies?.username;
		console.log("Username from cookie:", username); // Debug username
        const { rDate, availability } = req.body;
		
        if (!req.body.rDate || !req.body.availability) {
            return res.status(400).json({ message: "Missing required parameters: date and/or availability" });
            // return res.status(401).json({ message: "Unauthorized" });
        }
		console.log("Received params:", { username, rDate, availability});
		console.log("Type of rDate:", typeof rDate);
        // Convert rDate into a Date object
		const dateObject = new Date(rDate);
		console.log("Converted dateObject:", dateObject);
        // const formattedDate = new Date(rDate).toISOString().split('T')[0]; // Converts to YYYY-MM-DD string

		// Check if the date is valid
		/* if (isNaN(formattedDate)) {
			throw new Error('Invalid date format');
		} */
		// Get the weekday
		const options = {
			weekday: 'short'
		};
		const weekDay = new Intl.DateTimeFormat('en-US', options).format(dateObject);
		console.log("Calculated weekDay:", weekDay);
		// Check for existing document
		const existing = await Pigeon.findOne({rDate: dateObject, vName: username, availability: availability});

		if (existing) {
			throw new Error('A document with the same parameters already exists.');
		}
		// Create a document to insert
		const document = new Pigeon({
			rDate: dateObject,
			wkDay: weekDay,
			vName: username,
			availability: availability
		});
		
		// Save the document
		const result = await document.save();
		console.log("Document inserted:", result);
		console.log("Route parameters:", req.params); // Debug route parameters
        console.log("Request username:", username); // Debug username
		res.redirect(303, `/pigeons/getUserPigeons?username=${username}`);

	} catch (error) {
		console.error("Error while trying to insert document into Pigeons:", error);
		res.status(500).send("Error while trying to insert document into Pigeons: " + error.message);
		// Send error message to the client
	} 
}

const deletePigeon = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Pigeon ID required.' });

    const pigeon = await Pigeon.findOne({ _id: req.body.id }).exec();
    if (!pigeon) {
        return res.status(204).json({ "message": "No Pigeon matches your input." });
    }
    const result = await Pigeon.deleteOne(); //{ _id: req.body.id }
    console.log("Pigeon deleted!")
    res.json(result);
}

const getPigeon = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Pigeon ID required.' });

    const pigeon = await Pigeon.findOne({ _id: req.params.id }).exec();
    if (!pigeon) {
        return res.status(204).json({ "message": `No Pigeon matches ID ${req.params.id}.` });
    }
    res.json(pigeon);
}

module.exports = {
    servePigeonForm,
    getAllPigeons,
    getUserPigeons,
    createPigeon,
    deletePigeon,
    getPigeon
    
}