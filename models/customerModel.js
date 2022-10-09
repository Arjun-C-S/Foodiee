const mongoose = require("mongoose");

var schema = new mongoose.Schema({
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
      fullname: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
      pinCode: {
        type: Number,
      },
      city: {
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
  password: String,
});

const Customer = mongoose.model("Customer", schema);

module.exports = Customer;
