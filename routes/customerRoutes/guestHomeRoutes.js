const express = require("express");

const guestHomeController = require("../../controller/customerController/guestHomeController");

const router = express.Router();

router.get("/", guestHomeController.homeGet);

module.exports = router;