const Share = require("./Share");
const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected succsessfully");
    } catch (e) {
        throw new Error(`Failed to connect to database:\n ${e}`);
    }
}

module.exports = {
    Share,
    connect,
};