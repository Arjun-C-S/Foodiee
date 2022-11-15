const express = require("express");
const multer = require("multer");

const profileController = require("../../controller/customerController/profileController");

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

router.get("/profile", profileController.profileGet);

router.get("/editProfile", profileController.editProfileGet);

router.post("/editProfile", upload.single('customer_image') , profileController.editProfilePost);

module.exports = router;
