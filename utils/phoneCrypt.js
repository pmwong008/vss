const crypto = require("crypto");

// Utility functions for encryption/decryption
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
// const iv = crypto.randomBytes(16);

function encryptPhone(phone) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(phone, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encryptedData: encrypted, iv: iv.toString("hex") };
}

function decryptPhone(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Function to mask phone number when displaying
function maskPhone(phone) {
    return phone.replace(/\d(?=\d{4})/g, "*"); // Hides all but last 4 digits
}

module.exports = {
    encryptPhone,
    decryptPhone,
    maskPhone
};
// Usage example:
// const { encryptPhone, decryptPhone, maskPhone } = require('./utils/phoneCrypt');
// const { phoneEncrypted, iv } = encryptPhone("1234567890");
// console.log("Encrypted:", phoneEncrypted);
// console.log("Decrypted:", decryptPhone(phoneEncrypted, iv));
// console.log("Masked:", maskPhone("1234567890"));
