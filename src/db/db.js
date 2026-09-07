const dns = require("dns");
dns.setServers(["0.0.0.0", "8.8.8.8"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:");
  }
}

module.exports = connectDB;
