const Customer = require("../../models/customerModel");

exports.homeGet = (req, res) => {
  if (req.session.user) {
    res.render("customer/home", { name: req.session.user, pageTitle: "Home" });
  } else {
    res.redirect("/");
  }
};

exports.homePost = (req, res) => {
  
  Customer.find({email: req.body.email , password: req.body.password})
    .then((data) => {
      req.session.user = data[0]._id;
      res.redirect("/");
    })
    .catch((err) => {
      req.session.invalidCredentials = true;
      res.redirect("/");
    });
}