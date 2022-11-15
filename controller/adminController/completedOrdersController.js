const Order = require("../../models/orderModel");

exports.completedOrdersGet = (req, res) => {
  if(req.session.admin) {
    Order.find({
      $or: [
        {
          $and: [{ Payment_Status: "COMPLETED" }, { Order_Status: "DELIVERED" }],
        },
        {
          Order_Status: "REJECTED",
        },
        {
          Order_Status: "CANCELLED",
        },
      ],
    })
      .then((CompletedOrderData) => {
        res.render("Admin/CompletedOrders", {
          pageTitle: "Completed Orders",
          CompletedOrderData: CompletedOrderData,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.orderDeliverdPost = (req, res) => {};
