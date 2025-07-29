const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("./connetion");
const auth = require("./routes/auth");
const propertyList = require("./routes/propertyList");
const service = require("./routes/services");
const uploadRoute = require("./routes/upload"); // Import the upload route

const app = express();
const port = 4004;

app.use(express.json());
app.use(cors());
connectToDatabase("mongodb://127.0.0.1:27017/foresight_application");

// Move this UP to ensure images are served correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Router ---
app.use("/api", auth);
app.use("/api2", propertyList);
app.use("/api3", service);
app.use("/api4", uploadRoute); // Use the separate upload route

// Start server
app.listen(port, () => {
  console.log(" Server is running on port:", port);
});
