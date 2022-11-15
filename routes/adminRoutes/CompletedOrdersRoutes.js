const express = require("express");

const completedOrdersController = require("../../controller/adminController/completedOrdersController");

const router = express.Router();

router.get("/completedOrders", completedOrdersController.completedOrdersGet);

module.exports = router;