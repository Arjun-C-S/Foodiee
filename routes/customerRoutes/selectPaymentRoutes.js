const express = require("express");

const selectPaymentController = require("../../controller/customerController/selectPaymentController");

const router = express.Router();

router.get("/selectPayment", selectPaymentController.selectPaymentGet);

router.post("/selectPayment", selectPaymentController.selectPaymentPost);

module.exports = router;
