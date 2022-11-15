const express = require("express");

const couponController = require("../../controller/customerController/couponController");

const router = express.Router();

router.post("/applyCoupon", couponController.applyCouponPost);

router.post("/RemoveCoupon", couponController.RemoveCouponPost);

module.exports = router;