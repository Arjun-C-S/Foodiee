const Razorpay = require("razorpay");
const { ObjectId } = require("mongodb");
const date = require("date-and-time");
const moment = require("moment");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

var instance = new Razorpay({
  key_id: "rzp_test_lcKTIyLLpGzGaB",
  key_secret: "071shW082ud0Cf2EOCkzgBRT",
});

exports.GenerateOrderPost = (req, res) => {
  //   console.log("create orderId request", req.body);
  var options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "rcp1",
  };
  instance.orders.create(options, function (err, order) {
    // console.log(order);
    res.send({ orderId: order.id, amount: req.body.amount * 100 });
  });
};

exports.verifyPaymentPost = (req, res) => {
  // console.log(req.body);
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "071shW082ud0Cf2EOCkzgBRT")
    .update(body.toString())
    .digest("hex");
  // console.log("sig received ", req.body.response.razorpay_signature);
  // console.log("sig generated ", expectedSignature);
  if (expectedSignature === req.body.response.razorpay_signature) {
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
                Payment_Method: "RAZORPAY",
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
                                  Customer_id: ObjectId(req.session.user_id),
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
                      res.send({ signatureIsValid: true });
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
          res.send({ signatureIsValid: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("paymennt failed signature mismatch!!!");
    // console.log("sig received ", req.body.response.razorpay_signature);
    // console.log("sig generated ", expectedSignature);
  }
};
