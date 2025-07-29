const mongoose = require("mongoose");

const propertyschema = new mongoose.Schema(
  {
    img: {
      type: String,
      default: "https://i.postimg.cc/tTNXTz4B/icons8-real-estate-100.png",
    },    
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "sell",
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    parking: {
      type: String,
      default: "without parking",
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const PropertyList = mongoose.model("PropertyList", propertyschema);
module.exports = PropertyList;
