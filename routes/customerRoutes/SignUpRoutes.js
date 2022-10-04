const express = require("express");

const signupController = require("../../controller/customerController/signupController");

const router = express.Router();

router.get("/signUp", signupController.signUpGet);

router.post("/signUp", signupController.signUpPost);

module.exports = router;
