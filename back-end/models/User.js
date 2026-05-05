const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    major: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    schedule: {
      type: Array,
      default: [],
    },
    preferredLocations: {
      type: Array,
      default: [],
    },
    preferredMethods: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);