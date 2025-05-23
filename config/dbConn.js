const mongoose = require('mongoose');

/* const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
} */

const connectDB = async () => {
    try {
        const dbUri = process.env.DATABASE_URI;
        if (!dbUri) {
            throw new Error('DB Connection failed: No URI provided');
        }
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB with mongoose!');
        
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB