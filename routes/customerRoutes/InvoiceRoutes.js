const express = require("express");

const invoiceController = require("../../controller/customerController/invoiceController");

const router = express.Router();

router.get("/invoiceOrder", invoiceController.invoiceOrderGet);


module.exports = router;