// This script generates a random encryption key and saves it to a .env file
// It is supposed to be run once to create the key

const crypto = require("crypto");
const fs = require("fs");

const key = crypto.randomBytes(32).toString("hex"); // Generate a 32-byte key

/*
// This will overwrite existing .env file or create a new one
// Make sure to handle this carefully in production
fs.writeFileSync(".env", `ENCRYPTION_KEY=${key}\n`);
*/

// Append the key to `.env` without overwriting existing variables
fs.appendFileSync(".env", `\nENCRYPTION_KEY=${key}\n`);

console.log("Encryption key saved to .env!");
