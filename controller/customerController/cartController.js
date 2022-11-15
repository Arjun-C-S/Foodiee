const { ObjectId } = require("mongodb");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");

exports.cartGet = (req, res) => {
  if(req.session.user_id) {
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
      .then((cartData) => {
        Cart.aggregate([
          {
            $match: { Customer_id: ObjectId(req.session.user_id) },
          },
          {
            $lookup: {
              from: "coupons",
              localField: "isCoupon",
              foreignField: "Coupon_ID",
              as: "coupon",
            },
          },
        ])
          .then((couponData) => {
            // console.log(cartData);
            res.render("Customer/cart", {
              pageTitle: "Cart",
              cartData: cartData,
              couponData: couponData,
              profile_image: req.session.profile_image,
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
    res.redirect('/')
  }
  
};

exports.addToCartPost = (req, res) => {
  if(req.session.user_id) {
    Cart.find({ Customer_id: req.session.user_id })
    .then((InCartdata) => {
      if (InCartdata.length === 0) {
        Product.find({ _id: ObjectId(req.body.product_id) })
          .then((Product) => {
            let productData = [];
            productData.push({
              Product_id: Product[0]._id,
              Product_Quantity: 1,
              Unit_Price: Math.min(
                Product[0].product_price,
                Product[0].productOfferPrice,
                Product[0].categoryOfferPrice
              ),
              Total_Price: Math.min(
                Product[0].product_price,
                Product[0].productOfferPrice,
                Product[0].categoryOfferPrice
              ),
            });
            // console.log(productData);
            const cart = new Cart({
              Customer_id: req.session.user_id,
              Products: productData,
              Grand_Total: Math.min(
                Product[0].product_price,
                Product[0].productOfferPrice,
                Product[0].categoryOfferPrice
              ),
              isCoupon: 0,
            });
            cart
              .save(cart)
              .then((data) => {
                res.json({ ok: true });
                // console.log("added to cart");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Cart.find({
          $and: [
            { Customer_id: ObjectId(req.session.user_id) },
            { "Products.Product_id": ObjectId(req.body.product_id) },
          ],
        })
          .then((isProductInCart) => {
            // console.log(isProductInCart);
            if (isProductInCart.length === 0) {
              Product.find({ _id: ObjectId(req.body.product_id) })
                .then((Product) => {
                  Cart.findOneAndUpdate(
                    {
                      Customer_id: ObjectId(req.session.user_id),
                    },
                    {
                      $set: {
                        Grand_Total:
                          InCartdata[0].Grand_Total +
                          Math.min(
                            Product[0].product_price,
                            Product[0].productOfferPrice,
                            Product[0].categoryOfferPrice
                          ),
                      },
                      $push: {
                        Products: {
                          Product_id: Product[0]._id,
                          Product_Quantity: 1,
                          Unit_Price: Math.min(
                            Product[0].product_price,
                            Product[0].productOfferPrice,
                            Product[0].categoryOfferPrice
                          ),
                          Total_Price: Math.min(
                            Product[0].product_price,
                            Product[0].productOfferPrice,
                            Product[0].categoryOfferPrice
                          ),
                        },
                      },
                    }
                  )
                    .then((data) => {
                      // console.log(data);
                      res.json({ ok: true });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              Cart.find(
                {
                  $and: [
                    { Customer_id: req.session.user_id },
                    { "Products.Product_id": ObjectId(req.body.product_id) },
                  ],
                },
                { "Products.$": 1, Grand_Total: 1 }
              )
                .then((ProductDataForQuantity) => {
                  // console.log(ProductDataForQuantity);
                  let quantity =
                    ProductDataForQuantity[0].Products[0].Product_Quantity;
                  let unit_price =
                    ProductDataForQuantity[0].Products[0].Unit_Price;
                  Cart.findOneAndUpdate(
                    {
                      $and: [
                        { Customer_id: req.session.user_id },
                        {
                          "Products.Product_id": ObjectId(req.body.product_id),
                        },
                      ],
                    },
                    {
                      $set: {
                        "Products.$.Product_Quantity": quantity + 1,
                        "Products.$.Total_Price": req.body.price,
                        Grand_Total:
                          ProductDataForQuantity[0].Grand_Total + unit_price,
                      },
                    }
                  )
                    .then((data) => {
                      res.json({ ok: true });
                      // console.log(data);
                      // console.log("qnt of prd reduced from cart");
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
      }
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/')
  }
  
};

exports.removeFromCartPost = (req, res) => {
  if(req.session.user_id) {
    if (req.body.task == "decrement") {
      Cart.find({
        $and: [
          { Customer_id: req.session.user_id },
          { "Products.product_id": ObjectId(req.body.product_id) },
        ],
      })
        .then((cartProdQuant) => {
          Cart.find(
            {
              $and: [
                { Customer_id: req.session.user_id },
                { "Products.Product_id": ObjectId(req.body.product_id) },
              ],
            },
            { "Products.$": 1, Grand_Total: 1 }
          )
            .then((ProductDataForQuantity) => {
              let quantity =
                ProductDataForQuantity[0].Products[0].Product_Quantity;
              let unit_price = ProductDataForQuantity[0].Products[0].Unit_Price;
              Cart.findOneAndUpdate(
                {
                  $and: [
                    { Customer_id: req.session.user_id },
                    {
                      "Products.Product_id": ObjectId(req.body.product_id),
                    },
                  ],
                },
                {
                  $set: {
                    "Products.$.Product_Quantity": quantity - 1,
                    "Products.$.Total_Price": req.body.price,
                    Grand_Total:
                      ProductDataForQuantity[0].Grand_Total - unit_price,
                  },
                }
              )
                .then((data) => {
                  res.json({ ok: true });
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
      Cart.find(
        {
          $and: [
            { Customer_id: req.session.user_id },
            { "Products.Product_id": ObjectId(req.body.product_id) },
          ],
        },
        { "Products.$": 1, Grand_Total: 1 }
      )
        .then((ProductDataAndTotal) => {
          let Grand_Total = ProductDataAndTotal[0].Grand_Total;
          let Total_Price = ProductDataAndTotal[0].Products[0].Total_Price;
          Cart.updateOne(
            {
              $and: [
                { Customer_id: req.session.user_id },
                { "Products.Product_id": ObjectId(req.body.product_id) },
              ],
            },
            {
              $set: {
                Grand_Total: Grand_Total - Total_Price,
              },
              $pull: {
                Products: { Product_id: ObjectId(req.body.product_id) },
              },
            }
          )
            .then((data) => {
              Cart.find({ Customer_id: req.session.user_id })
                .then((ProductLength) => {
                  // console.log(ProductLength[0].Products.length);
                  res.json({ ProductLength: ProductLength[0].Products.length });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {});
    }
  } else {
    res.redirect('/')
  }
  
};
