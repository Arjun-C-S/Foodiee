const { ObjectId } = require("mongodb");
const date = require("date-and-time");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AeMw77Tn46bqIEbwn9_pr6n0AhQ95XXPw9lLi6ZayLRuLdx7gIWEzfCkX5ahQZzzJHRpo21CaRqz1onE",
  client_secret:
    "EPVyk_wJvgO2ZDJH3hHSyakHttCb3e23mGcIBD7QW-AwV8Ig-waAD6xKIeF3B4pVJ1S4V3mxDHwRUAnd",
});

exports.paypalPost = (req, res) => {
  let total_amount = (req.body.Total_Amount / 80).toFixed(2);
  // console.log(total_amount);
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url:
        "https://foodiee.herokuapp.com/Customer/success?total_amount=" + total_amount,
      cancel_url: "https://foodiee.herokuapp.com/Customer/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: total_amount,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: total_amount,
        },
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

exports.paypalPaymentSuccess = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: req.query.total_amount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        // console.log(JSON.stringify(payment));
        // res.send("Success");

        Cart.aggregate([
          { $unwind: "$Products" },
          {
            $match: { Customer_id: ObjectId(req.session.user_id) },
          },
          {
            $lookup: {
              from: "customers",
              localField: "Customer_id",
              foreignField: "_id",
              as: "cartCustomer",
            },
          },
          { $unwind: "$cartCustomer" },
          {
            $lookup: {
              from: "products",
              localField: "Products.Product_id",
              foreignField: "_id",
              as: "cartProduct",
            },
          },
          { $unwind: "$cartProduct" },
        ])
          .then((data) => {
            // console.log(data);
            let inSufficentStockProducts = true;
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].Products.Product_Quantity >
                data[i].cartProduct.product_quantity
              ) {
                inSufficentStockProducts = false;
              }
            }
            if (inSufficentStockProducts) {
              let productData = [];
              for (let i = 0; i < data.length; i++) {
                productData.push({
                  product_id: data[i].cartProduct._id,
                  product_image: data[i].cartProduct.product_image,
                  product_name: data[i].cartProduct.product_name,
                  product_quantity: data[i].Products.Product_Quantity,
                  product_price: Math.min(
                    data[i].cartProduct.product_price,
                    data[i].cartProduct.productOfferPrice,
                    data[i].cartProduct.categoryOfferPrice
                  ),
                  Total_Price:
                    Math.min(
                      data[i].cartProduct.product_price,
                      data[i].cartProduct.productOfferPrice,
                      data[i].cartProduct.categoryOfferPrice
                    ) * data[i].Products.Product_Quantity,
                });
              }
              Customer.find({ _id: req.session.user_id })
                .then((Delivery_Address) => {
                  for (let i = 0; i < Delivery_Address[0].Address.length; i++) {
                    if (Delivery_Address[0].Address[i].isActive === true) {
                      var Delivery_Address_Index = i;
                    }
                  }
                  function idAlphabets(length) {
                    let result = "";
                    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    let charactersLength = characters.length;
                    for (let i = 0; i < length; i++) {
                      result += characters.charAt(
                        Math.floor(Math.random() * charactersLength)
                      );
                    }
                    return result;
                  }
                  function idNumbers(length) {
                    let result = "";
                    let characters = "1234567890";
                    let charactersLength = characters.length;
                    for (let i = 0; i < length; i++) {
                      result += characters.charAt(
                        Math.floor(Math.random() * charactersLength)
                      );
                    }
                    return result;
                  }

                  let Order_id = idAlphabets(3) + idNumbers(5);

                  const order = new Order({
                    Customer_id: req.session.user_id,
                    Order_ID: Order_id,
                    Delivery_Address:
                      Delivery_Address[0].Address[Delivery_Address_Index],
                    Total_Amount: data[0].Grand_Total,
                    Order_Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                    Order_Date_toFilter: moment().format("L"),
                    Product: productData,
                    Payment_Method: "PAYPAL",
                    Payment_Status: "COMPLETED",
                    Order_Status: "PENDING",
                  });
                  order
                    .save(order)
                    .then((data) => {
                      Cart.find({ Customer_id: req.session.user_id })
                        .then((data) => {
                          for (let i = 0; i < data[0].Products.length; i++) {
                            Product.find(
                              { _id: data[0].Products[i].Product_id },
                              { product_quantity: 1 }
                            )
                              .then((Quantity) => {
                                // console.log(data[0].Products[i]);
                                Product.findOneAndUpdate(
                                  { _id: data[0].Products[i].Product_id },
                                  {
                                    $set: {
                                      product_quantity:
                                        Quantity[0].product_quantity -
                                        data[0].Products[i].Product_Quantity,
                                    },
                                  }
                                )
                                  .then((data) => {
                                    Cart.deleteMany({
                                      Customer_id: ObjectId(
                                        req.session.user_id
                                      ),
                                    })
                                      .then((deleted) => {
                                        req.session.orderStatus = true;
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
                          res.redirect("/Customer/Orders");
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
            } else {
              res.redirect('/Customer/cart')
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};

exports.paypalPaymentCancel = (req, res) => {
  res.redirect("/Customer/cart");
};
