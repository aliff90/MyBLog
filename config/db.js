const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db);

        console.log("DB Connected")
    } catch (error) {
        console.log("Error");

        process.exit(1)
    }
};

module.exports = connectDB;