const express = require("express");

const cartController = require("../../controller/customerController/cartController");

const router = express.Router();

router.get("/cart", cartController.cartGet);

router.patch("/addToCart", cartController.addToCartPost);

router.post("/removeFromCart", cartController.removeFromCartPost);

module.exports = router;