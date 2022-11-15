const express = require("express");

const pendingOrder = require("../../controller/adminController/pendingOrderController");

const router = express.Router();

router.get("/pendingOrders", pendingOrder.pendingOrdersGet);

router.post("/pendingOrders", pendingOrder.pendingOrdersPost);

module.exports = router;