const express = require("express");

const viewCustomerController = require("../../controller/adminController/viewCustomerController");

const router = express.Router();

router.get("/viewCustomer", viewCustomerController.viewCustomerGet);

router.post("/viewCustomer", viewCustomerController.viewCustomerPost);

router.get("/viewCustomerMore", viewCustomerController.viewCustomerMoreGet);

router.post("/viewCustomerMore", viewCustomerController.viewCustomerMorePost);

router.get("/BlockCustomer", viewCustomerController.BlockCustomerGet);

router.get("/unBlockCustomer", viewCustomerController.unBlockCustomerGet);

module.exports = router;