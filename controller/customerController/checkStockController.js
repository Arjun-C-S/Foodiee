const { ObjectId } = require("mongodb");
const date = require("date-and-time");

const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");
const Order = require("../../models/orderModel");

exports.checkStockGet = (req, res) => {
  if(req.session.user_id) {
    Cart.aggregate([
      {
        $match: { Customer_id: ObjectId(req.session.user_id) },
      },
      {
        $lookup: {
          from: "products",
          localField: "Product_id",
          foreignField: "_id",
          as: "cartProduct",
        },
      },
      { $unwind: "$cartProduct" },
    ])
      .then((cartData) => {
        //   console.log(cartData);
        let inSufficentStockProducts = 0;
        for (let i = 0; i < cartData.length; i++) {
          if (cartData[i].Quantity > cartData[i].cartProduct.product_quantity) {
            inSufficentStockProducts++;
          }
        }
        if (inSufficentStockProducts > 0) {
          req.session.inSufficentStockProducts = true;
          res.redirect("/Customer/cart");
        } else {
          res.redirect("/Customer/address");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};

exports.checkStockPost = (req, res) => {};
