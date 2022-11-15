const express = require("express");

const viewProductController = require("../../controller/customerController/viewProductController");

const router = express.Router();

router.get("/viewProduct", viewProductController.viewProductGet);

module.exports = router;