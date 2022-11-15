const express = require("express");

const walletController = require("../../controller/customerController/walletController");

const router = express.Router();

router.get("/wallet", walletController.walletGet);

module.exports = router;