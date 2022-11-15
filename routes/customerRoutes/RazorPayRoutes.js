const express = require("express");

const razorpayService = require("../../services/razorpay");

const router = express.Router();


router.post("/GenerateOrder", razorpayService.GenerateOrderPost);

router.post("/verifyPayment", razorpayService.verifyPaymentPost);


module.exports = router;
