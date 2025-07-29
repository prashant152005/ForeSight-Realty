const express = require("express");
const router = express.Router();
const ServiceList = require("../models/addservices");
const User = require("../models/user");

// ----ADD SERVICE----
router.post("/addservice", async (req, res) => {
    try {
      const {
        fullName,
        shopName,
        address,
        city,
        country,
        pincode,
        contactNumber,
        profession,
        user,
      } = req.body;
  
      // Check if the user exists
      console.log("Received data:", req.body);  // Log the incoming data
      const existingUser = await User.findById(user);
      if (!existingUser) {
        console.error("User does not exist:", user);  // Log if user is not found
        return res.status(404).json({ message: "User does not exist" });
      }
  
      // Create a new service object with the provided details
      const service = new ServiceList({
        fullName,
        shopName,
        address,
        city,
        country,
        pincode,
        contactNumber,
        profession,
        user: existingUser._id,
      });
  
      console.log("Saving service to the database...");
  
      // Save the new service to the database
      await service.save();
      existingUser.ServiceList.push(service._id);
      await existingUser.save();
  
      // Log successful service creation
      console.log("Service saved successfully:", service);
  
      return res.status(200).json({ service });
  
    } catch (error) {
      console.error("Error adding service:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  

// Get service by ID
router.get("/getservice/:id", async (req, res) => {
  try {
    const service = await ServiceList.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ----UPDATE SERVICE----
router.put("/updateservice/:id", async (req, res) => {
  try {
    const {
      fullName,
      shopName,
      address,
      city,
      country,
      pincode,
      contactNumber,
      profession,
    } = req.body;

    const updatedService = await ServiceList.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        shopName,
        address,
        city,
        country,
        pincode,
        contactNumber,
        profession,
      },
      { new: true } // Ensures the updated document is returned
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ message: "Service updated", updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ----DELETE SERVICE----
router.delete("/deleteservice/:id", async (req, res) => {
  try {
    const service = await ServiceList.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Remove service from user's serviceList
    await User.findByIdAndUpdate(service.user, {
      $pull: { ServiceList: req.params.id },
    });

    return res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ----GET ALL SERVICES----
router.get("/getallservices", async (req, res) => {
  try {
    const services = await ServiceList.find({});

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    return res.status(200).json({ message: "All services", services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ----GET ALL SERVICES LISTED BY USER----
router.get("/getallserviceslistedbyuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Received request for user ID:", userId); //  Debugging

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.log("User not found in database:", userId); // Debugging
      return res.status(404).json({ message: "User does not exist" });
    }

    console.log("User found:", existingUser); // Debugging
    console.log("User's service list:", existingUser.ServiceList); //  Debugging

    const services = await ServiceList.find({
      _id: { $in: existingUser.ServiceList },
    }).sort({ createdAt: -1 });

    if (!services || services.length === 0) {
      console.log("No services found for user:", userId); //  Debugging
      return res.status(404).json({ message: "No services found for this user" });
    }

    console.log("Services found:", services);
    return res.status(200).json({ message: "Services found", services });
  } catch (error) {
    console.error("Error fetching services by user ID:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;
