const mongoose = require("mongoose");

const connectToDatabase = async (url) => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/foresight_application")
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToDatabase;