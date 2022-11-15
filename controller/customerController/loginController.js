exports.checkUser = (req, res) => {
  if (req.session.user_id) {
    res.redirect("/Customer/home");
  } else {
    if (req.session.invalidCredentials) {
      req.session.invalidCredentials = false;
      res.render("Customer/login", {
        pageTitle: "Log In",
        accountCreated: false,
        invalidCredentials: true,
        userBlocked: false,
      });
    } else if (req.session.accountCreated) {
      req.session.accountCreated = false;
      res.render("Customer/login", {
        pageTitle: "Log In",
        accountCreated: true,
        invalidCredentials: false,
        userBlocked: false,
      });
    } else if (req.session.userBlocked) {
      req.session.userBlocked = false;
      res.render("Customer/login", {
        pageTitle: "Log In",
        accountCreated: false,
        invalidCredentials: false,
        userBlocked: true,
      });
    } else {
      res.render("Customer/login", {
        pageTitle: "Log In",
        accountCreated: false,
        invalidCredentials: false,
        userBlocked: false,
      });
    }
  }
};
