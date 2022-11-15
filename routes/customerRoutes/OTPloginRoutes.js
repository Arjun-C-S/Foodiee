const express = require("express");

const OTPloginService = require("../../services/OTPlogin");

const router = express.Router();

router.get("/OTPlogin/ConfirmContact", OTPloginService.ConfirmContactGet);

router.post("/OTPlogin/ConfirmContact", OTPloginService.ConfirmContactPost);

router.get("/OTPlogin", OTPloginService.OTPloginGet);

router.post("/OTPlogin", OTPloginService.OTPloginPost);

module.exports = router;
