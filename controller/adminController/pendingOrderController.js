const Order = require("../../models/orderModel");

exports.pendingOrdersGet = (req, res) => {
  if(req.session.admin) {
    Order.find({ Order_Status: "PENDING" })
    .then((pendingOrders) => {
      // console.log(pendingOrders);
      if(req.session.orderRejected) {
        req.session.orderRejected = false
        res.render("Admin/pendingOrders", {
          pageTitle: "Pending Orders",
          pendingOrders: pendingOrders,
          orderRejected: true,
          orderAccepted: false,
        });
      } else if (req.session.orderAccepted) {
        req.session.orderAccepted = false
        res.render("Admin/pendingOrders", {
          pageTitle: "Pending Orders",
          pendingOrders: pendingOrders,
          orderRejected: false,
          orderAccepted: true,
        });
      } else {
        res.render("Admin/pendingOrders", {
          pageTitle: "Pending Orders",
          pendingOrders: pendingOrders,
          orderRejected: false,
          orderAccepted: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.pendingOrdersPost = (req, res) => {};
