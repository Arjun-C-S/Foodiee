const express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var sharp = require("sharp");

const addProductController = require("../../controller/adminController/addProductController");
const viewProductController = require("../../controller/adminController/viewProductController");
const viewProductMoreController = require("../../controller/adminController/viewProductMoreController");
const deleteProductController = require("../../controller/adminController/deleteProductController");
const editProductController = require("../../controller/adminController/editProductController");

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({
  storage: storage,
}).fields([
  { name: "product_image1" },
  { name: "product_image2" },
  { name: "product_image3" },
  { name: "product_image4" },
]);

router.get("/addProducts", addProductController.addProductGet);

router.post("/addProducts", upload, addProductController.addProductPost);

router.get("/viewProducts", viewProductController.viewProductGet);

router.get("/viewProductsMore", viewProductMoreController.viewProductMoreGet);

router.get("/deleteProduct", deleteProductController.deleteProductGet);

router.get("/editProduct", editProductController.editProductGet);

router.post("/editProduct", upload, editProductController.editProductPost);

module.exports = router;
