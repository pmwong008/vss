const mongoose = require("mongoose");

const testBeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: {
        encryptedData: { type: String, required: true },
        iv: { type: String, required: true }
    }
});

module.exports = mongoose.model("TestBee", testBeeSchema);