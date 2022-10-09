exports.checkUser = (req, res) => {
  if(req.session.invalidCredentials) {
    req.session.invalidCredentials = false
    res.render("Customer/login", { pageTitle: "Log In" , accountCreated: false , invalidCredentials: true});
  } else if(req.session.accountCreated) {
    req.session.accountCreated = false
    res.render("Customer/login", { pageTitle: "Log In" , accountCreated: true , invalidCredentials: false});
  } else {
    res.render("Customer/login", { pageTitle: "Log In" , accountCreated: false , invalidCredentials: false});
  }
};
