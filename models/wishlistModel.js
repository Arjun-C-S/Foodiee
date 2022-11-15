const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Wishlist = mongoose.model("Wishlist", schema);

module.exports = Wishlist;
