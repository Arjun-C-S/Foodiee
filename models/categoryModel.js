const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Category_name: {
    type: String,
    required: true,
    unique: true,
  },
  Category_description: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", schema);

module.exports = Category;
