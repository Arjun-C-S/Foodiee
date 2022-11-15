const { ObjectId } = require("mongodb");
const Product = require("../../models/productModel");

exports.viewProductMoreGet = (req, res) => {
  if(req.session.admin) {
    Product.aggregate([
      {
        $match: { _id: ObjectId(req.query.product_id) },
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
      .then((response) => {
        if (req.session.productUpdated) {
          req.session.productUpdated = false;
          res.render("Admin/viewProductsMore", {
            pageTitle: "Product Details",
            data: response,
            productUpdated: true,
          });
        } else {
          res.render("Admin/viewProductsMore", {
            pageTitle: "Product Details",
            data: response,
            productUpdated: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.addProductPost = (req, res) => {};
