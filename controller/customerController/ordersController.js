const { ObjectId } = require("mongodb");
const moment = require("moment");

const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Wallet = require("../../models/walletModel");

exports.ordersGet = (req, res) => {
  if(req.session.user_id) {
    Order.find({ Customer_id: ObjectId(req.session.user_id) })
    .sort({ Order_Date: 1 })
    .then((orderData) => {
      //   console.log(orderData[0].Product.length);
      if (req.session.orderStatus) {
        req.session.orderStatus = false;
        res.render("Customer/order", {
          pageTitle: "Your Orders",
          orderData: orderData,
          orderStatus: true,
          profile_image: req.session.profile_image,
        });
      } else {
        res.render("Customer/order", {
          pageTitle: "Your Orders",
          orderData: orderData,
          orderStatus: false,
          profile_image: req.session.profile_image,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/')
  }
  
};

exports.orderCancelGet = (req, res) => {
  if(req.session.user_id) {
    Order.findOneAndUpdate(
      { _id: req.query.order_id },
      { Order_Status: "CANCELLED", Payment_Status: "CANCELLED" }
    )
      .then((data) => {
        Order.find({ _id: req.query.order_id })
          .then((data) => {
            for (let i = 0; i < data[0].Product.length; i++) {
              Product.find(
                { _id: data[0].Product[i].product_id },
                { product_quantity: 1 }
              )
                .then((Quantity) => {
                  // console.log(Quantity[0].product_quantity);
                  Product.findOneAndUpdate(
                    { _id: data[0].Product[i].product_id },
                    {
                      $set: {
                        product_quantity:
                          Quantity[0].product_quantity +
                          data[0].Product[i].product_quantity,
                      },
                    }
                  )
                    .then((data) => {
                      // console.log(data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            Wallet.find({ Customer_id: ObjectId(data[0].Customer_id) }).then(
              (WalletData) => {
                if (WalletData.length > 0) {
                  Wallet.findOneAndUpdate(
                    { Customer_id: ObjectId(data[0].Customer_id) },
                    {
                      $inc: { Wallet_Total: data[0].Total_Amount },
                      $push: {
                        Transactions: {
                          Order_id: data[0].Order_ID,
                          Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                          Status: "REFUNDED",
                          Amount: data[0].Total_Amount,
                        },
                      },
                    }
                  )
                    .then((data) => {
                      console.log(data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  let transactionData = [];
                  transactionData.push({
                    Order_id: data[0].Order_ID,
                    Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                    Status: "REFUNDED",
                    Amount: data[0].Total_Amount,
                  });
                  // console.log(productData);
                  const wallet = new Wallet({
                    Customer_id: ObjectId(data[0].Customer_id),
                    Wallet_Total: data[0].Total_Amount,
                    Transactions: transactionData,
                  });
                  wallet
                    .save(wallet)
                    .then((data) => {
                      // console.log("order rejected");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            );
          })
          .then((datawallet) => {
            //console.log(datawallet)
          })
          .catch((err) => {
            console.log(err);
          })
          .catch((err) => {
            console.log(err);
          });
        req.session.orderCancelled = true;
        res.redirect("/Customer/orders");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};

exports.viewOrderInvoiceGet = (req, res) => {
  if(req.session.user_id) {
    Order.aggregate([
      {
        $match: {
          _id: ObjectId(req.query.id),
          Customer_id: ObjectId(req.session.user_id),
        },
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
        res.render("Customer/viewOrderInvoice", {
          pageTitle: "Order Details",
          orderData: orderData,
          profile_image: req.session.profile_image,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};
