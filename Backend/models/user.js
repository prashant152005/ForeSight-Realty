const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  propertyList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyList",
    },
  ],
  ServiceList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceList",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
