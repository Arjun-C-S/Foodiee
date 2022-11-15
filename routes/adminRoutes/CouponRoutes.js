const express = require("express");

const couponController = require("../../controller/adminController/couponController");

const router = express.Router();

router.get("/coupons", couponController.couponGet);

router.get("/couponEdit", couponController.couponEditGet);

router.post("/coupon", couponController.couponPost);

router.post("/couponEdit", couponController.couponEditPost);

router.get("/deleteCoupon", couponController.deleteCouponGet);

module.exports = router;