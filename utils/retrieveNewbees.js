// This script connects to a MongoDB database and updates all documents in the Newbee collection
// to set the Archived field to false. It uses Mongoose for database operations and dotenv for environment variable management.
// This is supposed to be run as a standalone script, not as part of an Express route.
// This function is here to align the old Newbee collection with the new Newbee schema.

require("dotenv").config(); // Load .env variables

const mongoose = require("mongoose");
const Newbee = require("../model/Newbee"); // Adjust path if needed

async function updateArchivedField() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);

        await Newbee.updateMany({}, { $set: { Archived: false } });

        console.log("✅ All documents updated successfully!");
    } catch (error) {
        console.error("❌ Error updating documents:", error);
    } finally {
        mongoose.connection.close();
    }
}

updateArchivedField();
