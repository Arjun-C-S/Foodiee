const express = require("express");

const wishlistController = require("../../controller/customerController/wishlistController");

const router = express.Router();

router.get("/wishlist", wishlistController.wishlistGet);

router.post("/addToWishlist", wishlistController.addToWishlistPost);

router.post("/removeFromWishlist", wishlistController.removeFromWishlistPost);

module.exports = router;