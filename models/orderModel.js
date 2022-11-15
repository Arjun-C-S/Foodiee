const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Order_ID: {
    type: String,
    required: true,
  },
  Delivery_Address: {
    type: Array,
    required: true,
  },
  Total_Amount: {
    type: Number,
    required: true,
  },
  Order_Date: {
    type: String,
    required: true,
  },
  Order_Date_toFilter: {
    type: String,
    required: true,
  },
  Product: {
    type: Array,
    required: true,
  },
  Payment_Method: {
    type: String,
    required: true,
  },
  Payment_Status: {
    type: String,
    required: true,
  },
  Order_Status: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", schema);

module.exports = Order;
