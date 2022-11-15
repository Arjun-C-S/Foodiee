const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  Offer_Percentage: {
    type: Number,
    required: true,
  },
});

const CategoryOffer = mongoose.model("CategoryOffer", schema);

module.exports = CategoryOffer;
