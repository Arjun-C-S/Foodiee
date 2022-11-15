const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  Offer_Percentage: {
    type: Number,
    required: true,
  },
});

const ProductOffer = mongoose.model("ProductOffer", schema);

module.exports = ProductOffer;
