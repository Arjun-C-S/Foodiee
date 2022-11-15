const { ObjectId } = require("mongodb");
const Order = require("../../models/orderModel");

exports.viewOrderDetailsGet = (req, res) => {
  if(req.session.admin) {
    Order.aggregate([
      {
        $match: { _id: ObjectId(req.query.id) },
      },
      {
        $lookup: {
          from: "customers",
          localField: "Customer_id",
          foreignField: "_id",
          as: "orderCustomer",
        },
      },
      { $unwind: "$orderCustomer" },
    ])
      .then((orderData) => {
        // console.log(orderData);
        if (req.query.status) {
          res.render("Admin/viewOrderDetails", {
            pageTitle: "Order Details",
            orderData: orderData,
            orderStatus: true,
            OrderCompleted: false,
            salesreport: false,
          });
        } else if (req.query.OrderCompleted) { 
          res.render("Admin/viewOrderDetails", {
            pageTitle: "Order Details",
            orderData: orderData,
            orderStatus: false,
            OrderCompleted: true,
            salesreport: false,
          });
        } else if (req.query.salesreport) { 
          res.render("Admin/viewOrderDetails", {
            pageTitle: "Order Details",
            orderData: orderData,
            orderStatus: false,
            OrderCompleted: false,
            salesreport: true,
          });
        } else {
          res.render("Admin/viewOrderDetails", {
            pageTitle: "Order Details",
            orderData: orderData,
            orderStatus: false,
            OrderCompleted: false,
            salesreport: false,
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

exports.viewOrderDetailsPost = (req, res) => {};
