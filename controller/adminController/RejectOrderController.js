const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Wallet = require("../../models/walletModel");

const moment = require("moment");
const { ObjectId } = require("mongodb");

exports.RejectOrderGet = (req, res) => {
  if(req.session.admin) {
    Order.find({ _id: req.query.order_id })
    .then((data) => {
      if (data[0].Payment_Method === "COD") {
        Order.findOneAndUpdate(
          { _id: req.query.order_id },
          { Order_Status: "REJECTED", Payment_Status: "CANCELLED" }
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
              })
              .catch((err) => {
                console.log(err);
              });
            // console.log("order rejected");
            req.session.orderRejected = true;
            res.redirect("/Admin/pendingOrders");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Order.findOneAndUpdate(
          { _id: req.query.order_id },
          { Order_Status: "REJECTED", Payment_Status: "REFUNDED" }
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
                Wallet.find({ Customer_id: ObjectId(data[0].Customer_id) })
                  .then((WalletData) => {
                    if (WalletData.length > 0) {
                      Wallet.findOneAndUpdate(
                        { Customer_id: ObjectId(data[0].Customer_id) },
                        {
                          $push: {
                            Transactions: {
                              Order_id: ObjectId(req.query.order_id),
                              Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                              Status: "REFUNDED",
                            },
                          },
                          $inc: { Wallet_Total: data[0].Total_Amount },
                        }
                      )
                        .then((data) => {
                          console.log(data);
                          req.session.orderRejected = true;
                          res.redirect("/Admin/pendingOrders");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      let transactionData = [];
                      for (let i = 0; i < data.length; i++) {
                        transactionData.push({
                          Order_id: data[0].Order_ID,
                          Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                          Status: "REFUNDED",
                          Amount: data[0].Total_Amount,
                        });
                      }
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
                          req.session.orderRejected = true;
                          res.redirect("/Admin/pendingOrders");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
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
