exports.checkUser = (req, res) => {
  if(req.session.accountCreated) {
    req.session.accountCreated = false
    res.render("Customer/login", { pageTitle: "Log In" , accountCreated: true});
  } else {
    res.render("Customer/login", { pageTitle: "Log In" , accountCreated: false});
  }
};
