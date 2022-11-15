const express = require("express");

const productOffers = require("../../controller/adminController/productOffersController");

const router = express.Router();

router.get("/productOffers", productOffers.productOffersGet);

router.get("/productOffersEdit", productOffers.productOffersEditGet);

router.post("/productOffers", productOffers.productOffersPost);

router.post("/productOffersEdit", productOffers.productOffersEditPost);

router.get("/deleteproductOffers", productOffers.productOffersDeleteGet);

module.exports = router;