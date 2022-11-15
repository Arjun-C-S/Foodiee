const express = require("express");

const categoryOffers = require("../../controller/adminController/categoryOffersController");

const router = express.Router();

router.get("/categoryOffers", categoryOffers.categoryOffersGet);

router.get("/categoryOffersEdit", categoryOffers.categoryOffersEditGet);

router.post("/categoryOffers", categoryOffers.categoryOffersPost);

router.post("/categoryOffersEdit", categoryOffers.categoryOffersEditPost);

router.get("/deleteCategoryOffer", categoryOffers.categoryOffersDeleteGet);

module.exports = router;