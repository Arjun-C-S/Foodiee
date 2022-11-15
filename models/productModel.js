const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  product_image: {
    type: Array,
  },
  product_name: {
    type: String,
    required: true,
    unique: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  categoryOfferPrice: {
    type: Number,
    required: true,
  },
  productOfferPrice: {
    type: Number,
    required: true,
  },
  Category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
