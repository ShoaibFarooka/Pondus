const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    zip: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'employee', 'user']
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    refreshToken: {
      type: String,
      default: null
    },
    resetToken: {
      type: String,
      default: null
    },
    resetTokenExpiry: {
      type: Date,
      default: null
    },
    stripeCustomerId: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// const User = mongoose.model("user", userSchema);

module.exports = userSchema;
