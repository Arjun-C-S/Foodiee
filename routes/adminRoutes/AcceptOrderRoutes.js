const express = require("express");

const AcceptOrderController = require("../../controller/adminController/AcceptOrderController");

const router = express.Router();

router.get("/AcceptOrder", AcceptOrderController.AcceptOrderGet);

module.exports = router;