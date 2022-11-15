const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  Customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Transactions: {
    type: Array,
  },
  Wallet_Total: {
    type: Number,
    required: true,
  },
});

const Wallet = mongoose.model("Wallet", schema);

module.exports = Wallet;
