const { ObjectId } = require("mongodb");
const Wishlist = require("../../models/wishlistModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");

exports.viewProductGet = (req, res) => {
  if(req.session.user_id) {
    Product.find({ _id: req.query.prod_id })
    .then((ProductData) => {
      let prodInCart = false;
      let prodInWishlist = false;
      Cart.find({
        $and: [
          { Customer_id: req.session.user_id },
          { 'Products.Product_id': ObjectId(req.query.prod_id) },
        ],
      })
        .then((inCart) => {
          // console.log(inCart);
          Wishlist.find({
            $and: [
              { Customer_id: req.session.user_id },
              { Product_id: req.query.prod_id },
            ],
          })
            .then((inWishlist) => {
              if(inCart.length > 0) {
                prodInCart = true
              } else {
                prodInCart = false
              }
              if(inWishlist.length > 0) {
                prodInWishlist = true
              } else {
                prodInWishlist = false
              }
              res.render("Customer/viewProduct", {
                pageTitle: "View Product",
                profile_image: req.session.profile_image,
                ProductData: ProductData[0],
                inCart: prodInCart,
                inWishlist: prodInWishlist,
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
    res.redirect('/')
  }
  
};
