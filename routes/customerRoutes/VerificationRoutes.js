const express = require("express");

const VerificationService = require("../../services/OTP");

const router = express.Router();

router.get("/verification", VerificationService.VerificationGet);

router.post("/verification", VerificationService.VerificationPost);

module.exports = router;
