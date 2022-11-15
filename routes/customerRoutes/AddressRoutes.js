const express = require("express");

const addressController = require("../../controller/customerController/addressController");

const router = express.Router();

router.get("/address", addressController.addressGet);

router.get("/addAddress", addressController.addAddressGet);

router.post("/addAddress", addressController.addAddressPost);

router.get("/editAddress", addressController.editAddressGet);

router.post("/editAddress", addressController.editAddressPost);

router.get("/removeAddress", addressController.removeAddressGet);

router.post("/updateAddress", addressController.updateAddressPost);

module.exports = router;