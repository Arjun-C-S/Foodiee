const express = require("express");

const RejectOrderController = require("../../controller/adminController/RejectOrderController");

const router = express.Router();

router.get("/RejectOrder", RejectOrderController.RejectOrderGet);

module.exports = router;