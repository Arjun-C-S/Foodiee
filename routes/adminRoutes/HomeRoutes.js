const express = require("express");

const homeController = require("../../controller/adminController/homeController");

const router = express.Router();

router.get("/home", homeController.homeGet);

router.post("/home", homeController.homePost);

module.exports = router;