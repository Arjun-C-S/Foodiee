const express = require("express");

const loginController = require("../../controller/adminController/loginController");

const router = express.Router();

router.get("/", loginController.checkUser);

router.post("/", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
