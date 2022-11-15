const express = require("express");

const walletPaymentController = require("../../controller/customerController/walletPaymentController");

const router = express.Router();

router.get("/WalletPayment", walletPaymentController.walletPaymentGet);

module.exports = router;