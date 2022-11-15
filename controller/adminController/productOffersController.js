const { ObjectId } = require("mongodb");
const ProductOffer = require("../../models/ProductOfferModel");
const Product = require("../../models/productModel");

exports.productOffersGet = (req, res) => {
  if(req.session.admin) {
    Product.find().then((ProductData) => {
      ProductOffer.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "Product_id",
            foreignField: "_id",
            as: "ProductWithOffer",
          },
        },
        { $unwind: "$ProductWithOffer" },
      ])
        .then((OfferProductData) => {
          if (req.session.productOfferAdded) {
            req.session.productOfferAdded = false;
            res.render("Admin/productOffers", {
              pageTitle: "Product Offers",
              ProductData: ProductData,
              OfferProductData: OfferProductData,
              productOfferAdded: true,
              productOfferExists: false,
              productOfferUpdated: false,
              productOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.productOfferExists) {
            req.session.productOfferExists = false;
            res.render("Admin/productOffers", {
              pageTitle: "Product Offers",
              ProductData: ProductData,
              OfferProductData: OfferProductData,
              productOfferAdded: false,
              productOfferExists: true,
              productOfferUpdated: false,
              productOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.productOfferUpdated) {
            req.session.productOfferUpdated = false;
            res.render("Admin/productOffers", {
              pageTitle: "Product Offers",
              ProductData: ProductData,
              OfferProductData: OfferProductData,
              productOfferAdded: false,
              productOfferExists: false,
              productOfferUpdated: true,
              productOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.productOfferDeleted) {
            req.session.productOfferDeleted = false;
            res.render("Admin/productOffers", {
              pageTitle: "Product Offers",
              ProductData: ProductData,
              OfferProductData: OfferProductData,
              productOfferAdded: false,
              productOfferExists: false,
              productOfferUpdated: false,
              productOfferDeleted: true,
              isUpdate: false,
            });
          } else {
            res.render("Admin/productOffers", {
              pageTitle: "Product Offers",
              ProductData: ProductData,
              OfferProductData: OfferProductData,
              productOfferAdded: false,
              productOfferExists: false,
              productOfferUpdated: false,
              productOfferDeleted: false,
              isUpdate: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.productOffersPost = (req, res) => {
  if(req.session.admin) {
// new category offer
const productoffer = new ProductOffer({
  Product_id: req.body.Product_name,
  Offer_Percentage: req.body.Product_Offer,
});

// save category offer in the database
productoffer
  .save(productoffer)
  .then((data) => {
    Product.find({ _id: req.body.Product_name })
      .then((ProductData) => {
        let newPrice = Math.round(
          ProductData[0].product_price -
            (ProductData[0].product_price * Number(req.body.Product_Offer)) /
              100
        );
        Product.findOneAndUpdate(
          { _id: ProductData[0]._id },
          {
            $set: {
              productOfferPrice: newPrice,
            },
          }
        ).then((data) => {
          req.session.productOfferAdded = true;
          res.redirect("/Admin/productOffers");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    req.session.productOfferExists = true;
    res.redirect("/Admin/productOffers");
  });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.productOffersEditGet = (req, res) => {
  if(req.session.admin) {
    Product.find()
    .then((ProductData) => {
      ProductOffer.aggregate([
        {
          $match: { _id: ObjectId(req.query.offer_id) },
        },
        {
          $lookup: {
            from: "products",
            localField: "Product_id",
            foreignField: "_id",
            as: "ProductWithOffer",
          },
        },
        { $unwind: "$ProductWithOffer" },
      ])
        .then((OfferProductData) => {
          // console.log(OfferCategoryData);
          res.render("Admin/productOffers", {
            pageTitle: "Product Offers",
            ProductData: ProductData,
            OfferProductData: OfferProductData,
            productOfferAdded: false,
            productOfferExists: false,
            productOfferUpdated: false,
            productOfferDeleted: false,
            isUpdate: true,
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
    res.redirect('/Admin/')
  }
  
};

exports.productOffersEditPost = (req, res) => {
  if(req.session.admin) {
    const id = req.body.id;
    ProductOffer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update user with ${id}. Maybe user not found!`,
          });
        } else {
          Product.find({ _id: req.body.Product_id })
            .then((ProductData) => {
              console.log(ProductData);
              let newPrice = Math.round(
                ProductData[0].product_price -
                  (ProductData[0].product_price *
                    Number(req.body.Offer_Percentage)) /
                    100
              );
              Product.findOneAndUpdate(
                { _id: ProductData[0]._id },
                {
                  $set: {
                    productOfferPrice: newPrice,
                  },
                }
              ).then((data) => {
                req.session.productOfferUpdated = true;
                res.redirect("/Admin/productOffers");
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        req.session.productOfferExists = true;
        res.redirect("/Admin/productOffers");
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.productOffersDeleteGet = (req, res) => {
  if(req.session.admin) {
    ProductOffer.aggregate([
      {
        $match: { _id: ObjectId(req.query.offer_id) },
      },
      {
        $lookup: {
          from: "products",
          localField: "Product_id",
          foreignField: "_id",
          as: "ProductWithOffer",
        },
      },
      { $unwind: "$ProductWithOffer" },
    ])
      .then((ProductData) => {
        Product.find({ _id: ProductData[0].ProductWithOffer._id })
          .then((ProductData) => {
            Product.findOneAndUpdate(
              { _id: ProductData[0]._id },
              {
                $set: {
                  productOfferPrice: ProductData[0].product_price,
                },
              }
            ).then((data) => {
              const id = req.query.offer_id;
              ProductOffer.findByIdAndDelete(id)
                .then((data) => {
                  if (!data) {
                    res.status(404).send({
                      message: `Cannot Delete with id ${id}. Maybe id is wrong`,
                    });
                  } else {
                    req.session.productOfferDeleted = true;
                    res.redirect("/Admin/productOffers");
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message: "Could not delete User with id=" + id,
                  });
                });
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
    res.redirect('/Admin/')
  }
  
};
