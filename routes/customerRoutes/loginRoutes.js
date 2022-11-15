const express = require("express");

const loginController = require("../../controller/customerController/loginController");

const router = express.Router();

router.get("/", loginController.checkUser);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;
