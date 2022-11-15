const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  profile_image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  Address: [
    {
      name: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      alternativePhoneNumber: {
        type: String,
      },
      city: {
        type: String,
      },
      street: {
        type: String,
      },
      houseName: {
        type: String,
      },
      landMark: {
        type: String,
      },
      isActive: {
        type: Boolean,
      },
    },
  ],
  verificationPhone: {
    type: Boolean,
  },
  verificationEmail: {
    type: Boolean,
  },
  isBlocked: {
    type: Boolean,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", schema);

module.exports = Customer;
