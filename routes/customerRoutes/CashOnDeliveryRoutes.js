const express = require("express");

const cashOnDeliveryController = require("../../controller/customerController/cashOnDeliveryController");

const router = express.Router();

router.get("/cashOnDelivery", cashOnDeliveryController.cashOnDeliveryGet);

router.post("/cashOnDelivery", cashOnDeliveryController.cashOnDeliveryPost);

module.exports = router;
