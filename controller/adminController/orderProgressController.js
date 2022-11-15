const Order = require("../../models/orderModel");

exports.orderProgressGet = (req, res) => {
  if(req.session.admin) {
    Order.find({ Order_Status: "ACCEPTED" })
    .then((AcceptedData) => {
      res.render("Admin/AcceptedOrders", {
        pageTitle: "Accepted Orders",
        AcceptedData: AcceptedData,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.orderProgressPost = (req, res) => {};
