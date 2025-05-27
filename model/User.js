const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        encryptedData: { type: String, required: false },
        iv: { type: String, required: false }
    },
    remarks: { type: String, default: "" },
    
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);