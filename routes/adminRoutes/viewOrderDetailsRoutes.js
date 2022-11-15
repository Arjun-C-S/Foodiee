
const express = require("express");

const viewOrderDetails = require("../../controller/adminController/viewOrderDetailsController");

const router = express.Router();

router.get("/viewOrderDetails", viewOrderDetails.viewOrderDetailsGet);

router.post("/viewOrderDetails", viewOrderDetails.viewOrderDetailsPost);

module.exports = router;