const express = require("express");

const homeController = require("../../controller/customerController/homeController");

const router = express.Router();

router.get("/home", homeController.homeGet);

router.post("/home", homeController.homePost);

router.post("/homeFilterCategory", homeController.homeFilterCategoryPost);

module.exports = router;