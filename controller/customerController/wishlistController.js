const { ObjectId } = require("mongodb");
const Wishlist = require("../../models/wishlistModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");

exports.wishlistGet = (req, res) => {
  if(req.session.user_id) {
    Wishlist.aggregate([
      {
        $match: { Customer_id: ObjectId(req.session.user_id) },
      },
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
      .then((wishlistData) => {
        // console.log(wishlistData)
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
          .then((inCart) => {
            // console.log(wishlistData[0].wishlistProduct._id);
            // console.log("wishlist" + wishlistData[0]);
            // console.log("inCart" + inCart);
            res.render("Customer/wishlist", {
              pageTitle: "Cart",
              wishlistData: wishlistData,
              inCart: inCart,
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

exports.addToWishlistPost = (req, res) => {
  if(req.session.user_id) {
    Product.find({ _id: req.body.product_id })
    .then((data) => {
      // console.log(data[0].product_price);
      const wishlist = new Wishlist({
        Product_id: ObjectId(req.body.product_id),
        Customer_id: ObjectId(req.session.user_id),
      });

      wishlist
        .save(wishlist)
        .then((data) => {
          // console.log("added to wishlist");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  // adding to cart

  res.json({ ok: true });
  } else {
    res.redirect('/')
  }
  
};

exports.removeFromWishlistPost = (req, res) => {
  if(req.session.user_id) {
    Wishlist.find({
      $and: [
        { Customer_id: req.session.user_id },
        { Product_id: req.body.product_id },
      ],
    })
      .then((data) => {
        //   console.log(data);
        let wishlist_id = data[0]._id;
        Wishlist.findByIdAndDelete(wishlist_id)
          .then((data) => {
            // console.log("deleted from wishlist");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  
    res.json({ ok: true });
  } else {
    res.redirect('/')
  }
  
};
