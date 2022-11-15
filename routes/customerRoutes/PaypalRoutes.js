const express = require("express");

const paypalService = require("../../services/paypal");

const router = express.Router();

router.post("/paypal", paypalService.paypalPost);

router.get("/success", paypalService.paypalPaymentSuccess);

router.get("/cancel", paypalService.paypalPaymentCancel);

module.exports = router;
