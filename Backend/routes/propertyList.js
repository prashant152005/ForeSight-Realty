const express = require("express");
const router = express.Router();
const User = require("../models/user");
const PropertyList = require("../models/propertyList");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure upload folder exists
const fs = require("fs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


// ----ADD PROPERTY----
router.post("/addproperty", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      state,
      country,
      status,
      pincode,
      price,
      bedrooms,
      parking,
      area,
      user,
    } = req.body;

    //  Get the image file path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Create property object
    const property = new PropertyList({
      img: imagePath, //  Store image path
      title,
      address,
      city,
      country,
      state,
      price,
      status,
      bedrooms,
      pincode,
      description,
      parking,
      area,
      user: existingUser._id,
    });

    await property.save();
    existingUser.propertyList.push(property._id);
    await existingUser.save();

    return res.status(200).json({ property });
  } catch (error) {
    console.error("Error adding property:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// get propery by id
router.get("/getallproperties", async (req, res) => {
  try {
    const properties = await PropertyList.find({});

    if (!properties || properties.length === 0) {
      return res.status(200).send({ message: "No properties found" });
    }

    //  Ensure full image URL is sent to frontend
    const propertiesWithImageUrl = properties.map((property) => ({
      ...property._doc,
      img: property.img ? `http://localhost:4004${property.img}` : null,
    }));

    return res.status(200).json({ message: "All properties", properties: propertiesWithImageUrl });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ----UPDATE PROPERTY----
router.put("/updateproperty/:id", async (req, res) => {
  try {
    const {
      img,
      title,
      address,
      city,
      country,
      state,
      price,
      pincode,
      status,
      bedrooms,
      description,
      parking,
      area,
    } = req.body;

    const updatedProperty = await PropertyList.findByIdAndUpdate(
      req.params.id,
      {
        img,
        title,
        address,
        city,
        country,
        state,
        price,
        pincode,
        status,
        bedrooms,
        area,
        description,
        parking,
      },
      { new: true } // Ensures the updated document is returned
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({ message: "Property updated", updatedProperty });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// ----DELETE PROPERTY----
router.delete("/deleteproperty/:id", async (req, res) => {
  try {
    const property = await PropertyList.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).send({ message: "Property not found" });
    }

    await User.findByIdAndUpdate(property.user, {
      $pull: { propertyList: req.params.id },
    });

    return res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// ----GET ALL PROPERTIES----
// ----GET PROPERTY BY ID----
// ----GET PROPERTY BY ID----
router.get("/getproperty/:id", async (req, res) => {
  try {
    const property = await PropertyList.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    //  Append Full Image URL
    const propertyWithImage = {
      ...property._doc,
      img: property.img ? `http://localhost:4004${property.img}` : null,
    };

    return res.status(200).json({ message: "Property details", property: propertyWithImage });
  } catch (error) {
    console.error("Error fetching property details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// ----GET ALL PROPERTIES LISTED BY USER----
router.get("/getallproperties/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).send({ message: "User does not exist" });
    }

    // Find all properties associated with the user's propertyList
    const properties = await PropertyList.find({
      _id: { $in: existingUser.propertyList },
    }).sort({ createdAt: -1 });

    if (!properties || properties.length === 0) {
      return res.status(200).send({ message: "No properties found" });
    }

    return res.status(200).json({ message: "All properties", properties });
  } catch (error) {
    console.error("Error fetching properties by user ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
