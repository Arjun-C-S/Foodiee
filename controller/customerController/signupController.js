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

  // new user
  const user = new Customer({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    isBlocked: false,
  });
  
  // save user in the database
  user
    .save(user)
    .then((data) => {
      //res.send(data)
      res.redirect("/Customer/Verification?phone=" + req.body.phone + "&email=" + req.body.email);
    })
    .catch((err) => {
      req.session.emailExists = true;
      res.redirect("/customer/signup");
    });
};
