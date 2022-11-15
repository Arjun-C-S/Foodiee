const Order = require("../../models/orderModel");

exports.AcceptOrderGet = (req, res) => {
  if (req.session.admin) {
    Order.findOneAndUpdate(
      { _id: req.query.order_id },
      { Order_Status: "ACCEPTED" }
    )
      .then((data) => {
        // console.log("order accepted");
        req.session.orderAccepted = true;
        res.redirect("/Admin/pendingOrders");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/Admin/");
  }
};
