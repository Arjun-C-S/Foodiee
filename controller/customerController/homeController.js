const { ObjectId } = require("mongodb");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");
const Cart = require("../../models/cartModel");
const Wishlist = require("../../models/wishlistModel");
const CategoryOffer = require("../../models/CategoryOfferModel");
const Category = require("../../models/categoryModel");

exports.homeGet = (req, res) => {
  if (req.session.user_id) {
    // to get all products in data variable
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
                            res.render("Customer/home", {
                              pageTitle: "Home",
                              customerName: req.session.user,
                              products: data,
                              Category: Categories,
                              Customer_data: Customer_data,
                              inCart: inCart,
                              inWishlist: inWishlist,
                              profile_image: req.session.profile_image,
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
    res.redirect("/");
  }
};

exports.homePost = (req, res) => {
  Customer.find({ email: req.body.email, password: req.body.password })
    .then((data) => {
      if (data[0].isBlocked === false) {
        req.session.user_id = data[0]._id;
        req.session.profile_image = data[0].profile_image;
        res.redirect("/");
      } else {
        req.session.userBlocked = true;
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.session.invalidCredentials = true;
      res.redirect("/");
    });
};

exports.homeFilterCategoryPost = (req, res) => {
  // console.log(req.body.category_id);
  if (req.body.category_id == "ALL") {
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
      .then((dataToshow) => {
        res.json({
          productsToHide: [],
          productsToShow: dataToshow,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Product.aggregate([
      {
        $match: { Category_id: { $nin: [ObjectId(req.body.category_id)] } },
      },
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
      .then((dataToHide) => {
        // console.log(data);
        Product.aggregate([
          {
            $match: { Category_id: ObjectId(req.body.category_id) },
          },
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
          .then((dataToshow) => {
            res.json({
              productsToHide: dataToHide,
              productsToShow: dataToshow,
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
};
