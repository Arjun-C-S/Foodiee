const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Coupon_name: {
    type: String,
    required: true,
    unique: true,
  },
  Coupon_ID: {
    type: String,
    required: true,
  },
  Offer_Percentage: {
    type: Number,
    required: true,
  },
  Customer: {
    type: Array,
  }
});

const Coupon = mongoose.model("Coupon", schema);

module.exports = Coupon;
