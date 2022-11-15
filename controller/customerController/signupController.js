const Customer = require("../../models/customerModel");

exports.signUpGet = (req, res) => {
  if (req.session.emailExists) {
    req.session.emailExists = false;
    res.render("Customer/signUp", { pageTitle: "Sign Up", emailExists: true });
  } else {
    res.render("Customer/signUp", { pageTitle: "Sign Up", emailExists: false });
  }
};

exports.signUpPost = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be emtpy!" });
    return;
  }

  req.session.customer_name = req.body.name;
  req.session.customer_email = req.body.email;
  req.session.customer_phone = req.body.phone;
  req.session.customer_password = req.body.password;
  req.session.referrel = req.body.referrel;

  Customer.findOneAndUpdate(
    { email: req.body.email },
    { verificationPhone: true },
    { useFindAndModify: false }
  ).then((data) => {
    if (!data) {
      res.redirect("/Customer/Verification");
    } else {
      req.session.emailExists = true;
      res.redirect("/Customer/signUp");
    }
  });
};
