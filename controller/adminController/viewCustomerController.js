const Customer = require("../../models/customerModel");

exports.viewCustomerGet = (req, res) => {
  if(req.session.admin) {
    Customer.find()
    .then((response) => {
      res.render("Admin/viewCustomer", {
        pageTitle: "Customers",
        customer: response,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.viewCustomerPost = (req, res) => {};

exports.viewCustomerMoreGet = (req, res) => {
  if(req.session.admin) {
    const id = req.query.id;
    Customer.find({ _id: id })
      .then((CustomerData) => {
        res.render("Admin/ViewCustomerMore", {
          pageTitle: "Customer Details",
          CustomerData: CustomerData,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.viewCustomerMorePost = (req, res) => {};

exports.BlockCustomerGet = (req, res) => {
  if(req.session.admin) {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty" });
    }
    const id = req.query.id;
    Customer.findByIdAndUpdate(
      { _id: id },
      { isBlocked: true },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update user with ${id}. Maybe user not found!`,
          });
        } else {
          // console.log(data);
          req.session.isBLocked = true;
          res.redirect("/Admin/viewCustomer");
          // res.send(data)
        }
      })
      .catch((err) => {
        res.redirect("/Admin/viewCustomer");
        // res.status(500).send({ message : "Error Update user information"})
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.unBlockCustomerGet = (req, res) => {
  if(req.session.admin) {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty" });
    }
    const id = req.query.id;
    Customer.findByIdAndUpdate(
      { _id: id },
      { isBlocked: false },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update user with ${id}. Maybe user not found!`,
          });
        } else {
          // console.log(data);
          req.session.isBLocked = true;
          res.redirect("/Admin/viewCustomer");
          // res.send(data)
        }
      })
      .catch((err) => {
        res.redirect("/Admin/viewCustomer");
        // res.status(500).send({ message : "Error Update user information"})
      });
  } else {
    res.redirect('/Admin/')
  }
  
};
