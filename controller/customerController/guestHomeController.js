const { ObjectId } = require("mongodb");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");
const Cart = require("../../models/cartModel");
const Wishlist = require("../../models/wishlistModel");
const CategoryOffer = require("../../models/CategoryOfferModel");
const Category = require("../../models/categoryModel");

exports.homeGet = (req, res) => {
  if (!req.session.user_id) {
    Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "Category_id",
          foreignField: "_id",
          as: "Result",
        },
      },
      { $unwind: "$Result" },
    ])
      .then((data) => {
        // to get customer details or to display name in home matching user ids
        Customer.find({ _id: req.session.user_id })
          // inner joining cart collection with customer and product table
          .then((Customer_data) => {
            Cart.aggregate([
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
              .then((inCart) => {
                Wishlist.aggregate([
                  {
                    $match: { Customer_id: ObjectId(req.session.user_id) },
                  },
                  {
                    $lookup: {
                      from: "customers",
                      localField: "Customer_id",
                      foreignField: "_id",
                      as: "wishlistCustomer",
                    },
                  },
                  { $unwind: "$wishlistCustomer" },
                  {
                    $lookup: {
                      from: "products",
                      localField: "Product_id",
                      foreignField: "_id",
                      as: "wishlistProduct",
                    },
                  },
                  { $unwind: "$wishlistProduct" },
                ])
                  .then((inWishlist) => {
                    // console.log(data);
                    CategoryOffer.find()
                      .then((CategoryWithOffer) => {
                        Category.find()
                          .then((Categories) => {
                            // console.log(data);
                            res.render("Guest/GuestHome", {
                              pageTitle: "Guest Home",
                              products: data,
                              Category: Categories,
                              Customer_data: Customer_data,
                              inCart: inCart,
                              inWishlist: inWishlist,
                              CategoryWithOffer: CategoryWithOffer,
                            });
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
    res.redirect("/Customer/Home");
  }
};
