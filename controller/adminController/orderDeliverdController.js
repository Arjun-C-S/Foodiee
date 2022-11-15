const Order = require("../../models/orderModel");

exports.orderDeliverdGet = (req, res) => {
  if(req.session.admin) {
    Order.findOneAndUpdate(
      { $and: [{ _id: req.query.order_id }] },
      { $set:  { Order_Status: "DELIVERED" ,  Payment_Status: "COMPLETED" } }
    )
      .then((data) => {
        // console.log("order accepted");
        req.session.orderDelivered = true;
        res.redirect("/Admin/orderProgress");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.orderDeliverdPost = (req, res) => {};
