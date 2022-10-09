exports.checkUser = (req, res) => {
  if(req.session.admin){
    res.redirect("/Admin/home");
  } else {
    if(req.session.invalidCredentials) {
      req.session.invalidCredentials = false
      res.render("Admin/login", { pageTitle: " Admin Log In" , invalidCredentials: true});
    } else {
      res.render("Admin/login", { pageTitle: "Admin Log In" , invalidCredentials: false});
    }
  }
};
