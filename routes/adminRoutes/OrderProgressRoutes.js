const express = require("express");

const orderProgress = require("../../controller/adminController/orderProgressController");

const router = express.Router();

router.get("/orderProgress", orderProgress.orderProgressGet);

router.post("/orderProgress", orderProgress.orderProgressPost);

module.exports = router;