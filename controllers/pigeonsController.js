const mongoose = require('mongoose'); // Import the Mongoose library
const Pigeon = require('../model/Pigeon');
const calculateWeekday = require('../utils/calculateWeekday'); // Import the utility function

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
        // const username = req.query?.username;// Check for valid username
		const { username } = req.cookies; 
		// const sortOrder = req.query?.order === "desc" ? -1 : 1; // Default to ascending order
		if (!username || typeof username !== 'string') {
            return res.status(400).json({ message: "Invalid username provided." });
        }
		console.log("Username from query:", username); // Debug username
		
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
		
		const pigeons = await Pigeon.find({ 
			vName: username,
			rDate: {$gte: today },
		 }).sort({ rDate: 1 }).exec();
		// const pigeons = await Pigeon.find({ vName: username }).sort({ rDate: sortOrder }).exec();

		if (!pigeons || pigeons.length === 0) {
			// return res.status(204).json({ 'message': 'No pigeons found.' });
			return res.render('pigeonsByUsername', { vName: username, pigeons: [], message: "You currently have no scheduled sessions." });
		}

		//res.json(pigeons);
		// res.render('pigeonsByUsername', { pigeons, vName: username, sortOrder }, { async: true });
		res.render('pigeonsByUsername', { pigeons, vName: username });
	
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
            // return res.json({ message: "Missing required parameters: date and/or availability" });
            // return res.status(401).json({ message: "Unauthorized" });
            return res.status(401).send(`
				<html>
				  <head>
					<style>
					  body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
					  .error-message { font-size: 28px; color: red; font-weight: bold; }
					</style>
				  </head>
				  <body>
					<h3 class="error-message">Missing required parameters: date and/or availability.</h3>
					<a href="/pigeons/form">Back to Sign Up Sheet</a>
				  </body>
				</html>
			  `);
        }

        // Convert rDate into a Date object
		const dateObject = new Date(rDate);

		// Get the weekday
		const wkDay = calculateWeekday(dateObject);
		if (!wkDay) {
			return res.status(400).json({ message: "Server not getting the weekday from dateObject." });
		}

		// Check for existing document
		const existing = await Pigeon.findOne({rDate: dateObject, vName: username, availability: availability});

		if (existing) {
			throw new Error('A document with the same parameters already exists.');
		}
		// Create a document to insert
		const document = new Pigeon({
			rDate: dateObject,
			wkDay: wkDay,
			vName: username,
			availability: availability
		});
		
		// Save the document
		const result = await document.save();

		res.redirect(303, `/pigeons/getUserPigeons?username=${username}`);

	} catch (error) {
		console.error("Error while trying to insert document into Pigeons:", error);
		res.status(500).send("Error while trying to insert document into Pigeons: " + error.message);
		// Send error message to the client
	} 
}

const deletePigeon = async (req, res) => {
	try {
	  const { id } = req.params; // Get session ID from the URL
	  console.log("Delete Pigeon route hit! ID received:", id); // Debug ID
	  const session = await Pigeon.findById(id);
	  if (!session) {
		return res.status(404).json({ message: "Session not found." });
	  }
	  // Validate the format of the ID
	 if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: "Invalid ID format." });
	} 

	// Check if the session is less than 72 hours away, and as of 20250501 script is running from frontend
	/* const now = new Date();
    const sessionDate = new Date(session.rDate);
    const hoursDifference = (sessionDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 72) {
      return res.status(400).json({ message: "Cannot delete a session that is less than 72 hours away." });
    } */
	 
	  const deletedSession = await Pigeon.findByIdAndDelete(id); // Use Mongoose to delete by ID
  
	  if (!deletedSession) {
		return res.status(404).json({ message: "Session not found." });
	  }
  
	  res.status(200).json({ message: "Session deleted successfully." });
	} catch (error) {
	  console.error("Error while deleting session:", error);
	  res.status(500).json({ message: "Internal Server Error." });
	}
  };
  

  const getPigeon = async (req, res) => {
    try {
        const { id } = req.params;
        const pigeon = await Pigeon.findById(id);
        if (!pigeon) return res.status(404).json({ message: "Pigeon not found." });
        res.json(pigeon);
    } catch (error) {
        console.error("Error fetching pigeon:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const getPigeonsByDateRange = async (req, res) => {
	try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide both start and end dates.' });
        }

		// Convert string dates to full Date objects
        const start = new Date(`${startDate}`); // Ensures UTC format
        const end = new Date(`${endDate}`); // Covers entire end date

        // Query Pigeons within selected date range
        const pigeons = await Pigeon.find({
            //rDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
			rDate: { $gte: start, $lte: end }
		}).sort({ rDate: 1 }); // Sort by rDate in ascending order

        res.json({ pigeons }); // Return JSON response instead of rendering a new page    } catch (error) {
    } catch (error) {
		console.error('Error fetching Pigeons:', error);
		res.status(500).json({ message: 'Server error occurred.' });
	}
};


module.exports = {
    servePigeonForm,
    getAllPigeons,
    getUserPigeons,
    createPigeon,
    deletePigeon,
    getPigeon,
	getPigeonsByDateRange
    
}