const express = require("express");

const checkStockController = require("../../controller/customerController/checkStockController");

const router = express.Router();

router.get("/checkStock", checkStockController.checkStockGet);

router.post("/checkStock", checkStockController.checkStockPost);

module.exports = router;