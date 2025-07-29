const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// ----REGISTER----
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, phonenumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email ID is already registered. Please use a different email address." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new usern
    const user = new User({
      email: email,
      username: username,
      phonenumber:phonenumber,
      password: hashedPassword,
    });

    // Save user to the database
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----LOGIN----
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { password: omit, ...userResponse } = user._doc;
    // Successful login
    res.status(200).json({ message: "Welcome!!!", userResponse });
    console.log(userResponse.username);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----GET USER----
router.get("/getuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (existingUser) {
      return res.json({ user: existingUser });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
