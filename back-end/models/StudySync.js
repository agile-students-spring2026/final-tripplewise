const mongoose = require("mongoose");

const studySyncSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    members: [
      {
        type: String,
        trim: true,
      },
    ],
    maxMembers: {
      type: Number,
      default: 5,
      min: 1,
      max: 50,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    createdBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudySync", studySyncSchema);
