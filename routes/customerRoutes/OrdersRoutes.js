const express = require("express");

const ordersController = require("../../controller/customerController/ordersController");

const router = express.Router();

router.get("/orders", ordersController.ordersGet);

router.get("/orderCancel", ordersController.orderCancelGet);

router.get("/viewOrderInvoice", ordersController.viewOrderInvoiceGet);

module.exports = router;
