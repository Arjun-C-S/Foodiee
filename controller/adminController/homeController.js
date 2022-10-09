const Admin = require("../../models/adminModel");

exports.homeGet = (req, res) => {
  if (req.session.admin) {
    res.render("Admin/home", { adminName: req.session.admin, pageTitle: "Admin || Dashboard" });
  } else {
    res.redirect("/Admin/");
  }
};

exports.homePost = (req, res) => {
  Admin.find({email: req.body.email , password: req.body.password})
    .then((data) => {
      req.session.admin = data[0].name;
      res.redirect("/Admin/home");
    })
    .catch((err) => {
      req.session.invalidCredentials = true;
      res.redirect("/Admin/");
    });
}