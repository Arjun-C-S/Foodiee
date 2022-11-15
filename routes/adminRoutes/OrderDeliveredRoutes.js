const express = require("express");

const orderDeliverd = require("../../controller/adminController/orderDeliverdController");

const router = express.Router();

router.get("/orderDeliverd", orderDeliverd.orderDeliverdGet);

router.post("/orderDeliverd", orderDeliverd.orderDeliverdPost);

module.exports = router;