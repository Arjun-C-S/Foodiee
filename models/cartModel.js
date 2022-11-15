const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Products: {
    type: Array,
    required: true,
  },
  Grand_Total: {
    type: Number,
    required: true,
  },
  isCoupon: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("Cart", schema);

module.exports = Cart;
