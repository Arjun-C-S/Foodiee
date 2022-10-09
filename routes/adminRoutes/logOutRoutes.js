const express = require("express");

const router = express.Router();

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/Admin");
  });

module.exports = router;
