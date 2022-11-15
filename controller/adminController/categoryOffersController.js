const { ObjectId } = require("mongodb");
const Category = require("../../models/categoryModel");
const CategoryOffer = require("../../models/CategoryOfferModel");
const Product = require("../../models/productModel");

exports.categoryOffersGet = (req, res) => {
  if(req.session.admin) {
    Category.find().then((CategoryData) => {
      CategoryOffer.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "Category_id",
            foreignField: "_id",
            as: "CategoryWithOffer",
          },
        },
        { $unwind: "$CategoryWithOffer" },
      ])
        .then((OfferCategoryData) => {
          if (req.session.categoryOfferAdded) {
            req.session.categoryOfferAdded = false;
            res.render("Admin/categoryOffers", {
              pageTitle: "Category Offers",
              CategoryData: CategoryData,
              OfferCategoryData: OfferCategoryData,
              categoryOfferAdded: true,
              categoryOfferExists: false,
              categoryOfferUpdated: false,
              categoryOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.categoryOfferExists) {
            req.session.categoryOfferExists = false;
            res.render("Admin/categoryOffers", {
              pageTitle: "Category Offers",
              CategoryData: CategoryData,
              OfferCategoryData: OfferCategoryData,
              categoryOfferAdded: false,
              categoryOfferExists: true,
              categoryOfferUpdated: false,
              categoryOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.categoryOfferUpdated) {
            req.session.categoryOfferUpdated = false;
            res.render("Admin/categoryOffers", {
              pageTitle: "Category Offers",
              CategoryData: CategoryData,
              OfferCategoryData: OfferCategoryData,
              categoryOfferAdded: false,
              categoryOfferExists: false,
              categoryOfferUpdated: true,
              categoryOfferDeleted: false,
              isUpdate: false,
            });
          } else if (req.session.categoryOfferDeleted) {
            req.session.categoryOfferDeleted = false;
            res.render("Admin/categoryOffers", {
              pageTitle: "Category Offers",
              CategoryData: CategoryData,
              OfferCategoryData: OfferCategoryData,
              categoryOfferAdded: false,
              categoryOfferExists: false,
              categoryOfferUpdated: false,
              categoryOfferDeleted: true,
              isUpdate: false,
            });
          } else {
            res.render("Admin/categoryOffers", {
              pageTitle: "Category Offers",
              CategoryData: CategoryData,
              OfferCategoryData: OfferCategoryData,
              categoryOfferAdded: false,
              categoryOfferExists: false,
              categoryOfferUpdated: false,
              categoryOfferDeleted: false,
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

exports.categoryOffersPost = (req, res) => {
  if(req.session.admin) {
// new category offer
const categoryoffer = new CategoryOffer({
  Category_id: req.body.Category_name,
  Offer_Percentage: req.body.Category_Offer,
});

// save category offer in the database
categoryoffer
  .save(categoryoffer)
  .then((data) => {
    Product.find({ Category_id: req.body.Category_name })
      .then((CategoryProductData) => {
        // console.log(CategoryProductData.length);
        for (let i = 0; i < CategoryProductData.length; i++) {
          let newPrice = Math.round(
            CategoryProductData[i].product_price -
              (CategoryProductData[i].product_price *
                Number(req.body.Category_Offer)) /
                100
          );
          Product.findOneAndUpdate(
            { _id: CategoryProductData[i]._id },
            {
              $set: {
                categoryOfferPrice: newPrice,
              },
            }
          ).then((data) => {
            // console.log(data);
          });
        }
        req.session.categoryOfferAdded = true;
        res.redirect("/Admin/categoryOffers");
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    req.session.categoryOfferExists = true;
    res.redirect("/Admin/categoryOffers");
  });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.categoryOffersEditGet = (req, res) => {
  if(req.session.admin) {
    Category.find()
    .then((CategoryData) => {
      CategoryOffer.aggregate([
        {
          $match: { _id: ObjectId(req.query.offer_id) },
        },
        {
          $lookup: {
            from: "categories",
            localField: "Category_id",
            foreignField: "_id",
            as: "CategoryWithOffer",
          },
        },
        { $unwind: "$CategoryWithOffer" },
      ])
        .then((OfferCategoryData) => {
          // console.log(OfferCategoryData);
          res.render("Admin/categoryOffers", {
            pageTitle: "Category Offers",
            CategoryData: CategoryData,
            OfferCategoryData: OfferCategoryData,
            categoryOfferAdded: false,
            categoryOfferExists: false,
            categoryOfferUpdated: false,
            categoryOfferDeleted: false,
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

exports.categoryOffersEditPost = (req, res) => {
  if(req.session.admin) {
    const id = req.body.id;
    CategoryOffer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update user with ${id}. Maybe user not found!`,
          });
        } else {
          Product.find({ Category_id: ObjectId(req.body.Category_id) })
            .then((CategoryProductData) => {
              // console.log(CategoryProductData.length);
              for (let i = 0; i < CategoryProductData.length; i++) {
                let newPrice = Math.round(
                  CategoryProductData[i].product_price -
                    (CategoryProductData[i].product_price *
                      Number(req.body.Offer_Percentage)) /
                      100
                );
                Product.findOneAndUpdate(
                  { _id: CategoryProductData[i]._id },
                  {
                    $set: {
                      categoryOfferPrice: newPrice,
                    },
                  }
                ).then((data) => {
                  // console.log(data);
                });
              }
              req.session.categoryOfferUpdated = true;
              res.redirect("/Admin/categoryOffers");
              // res.send(data)
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        req.session.categoryOfferExists = true;
        res.redirect("/Admin/categoryOffers");
        // res.status(500).send({ message : "Error Update user information"})
      });
  } else {
    res.redirect('/Admin/')
  }

};

exports.categoryOffersDeleteGet = (req, res) => {
  if(req.session.admin) {
    CategoryOffer.aggregate([
      {
        $match: { _id: ObjectId(req.query.offer_id) },
      },
      {
        $lookup: {
          from: "categories",
          localField: "Category_id",
          foreignField: "_id",
          as: "CategoryWithOffer",
        },
      },
      { $unwind: "$CategoryWithOffer" },
    ])
      .then((CategoryProductData) => {
        Product.find({
          Category_id: CategoryProductData[0].CategoryWithOffer._id,
        })
          .then((productInCategory) => {
            // console.log(productInCategory);
            for (let i = 0; i < productInCategory.length; i++) {
              Product.findOneAndUpdate(
                { _id: productInCategory[i]._id },
                {
                  $set: {
                    categoryOfferPrice: productInCategory[i].product_price,
                  },
                }
              )
                .then((data) => {
                  // console.log(data);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            const id = req.query.offer_id;
            CategoryOffer.findByIdAndDelete(id)
              .then((data) => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot Delete with id ${id}. Maybe id is wrong`,
                  });
                } else {
                  req.session.categoryOfferDeleted = true;
                  res.redirect("/Admin/categoryOffers");
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Could not delete User with id=" + id,
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
