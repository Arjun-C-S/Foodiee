const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
sharp.cache(false);

const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");

exports.editProductGet = (req, res) => {
  if (req.session.admin) {
    Product.aggregate([
      {
        $match: { _id: ObjectId(req.query.id) },
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
        Category.find()
          .then((categories) => {
            res.render("Admin/editProduct", {
              pageTitle: "Edit Product Details",
              data: response,
              category: categories,
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
    res.redirect("/Admin/");
  }
};

exports.editProductPost = async (req, res) => {
  if (req.session.admin) {
    const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve, reject) => {
        sharp(path.join(file))
          .resize(1200, 600)
          .toBuffer(function (err, buffer) {
            fs.writeFile(path.join(file), buffer, function (e) {
              cloudinary.uploader.upload(file, (err, res) => {
                if (err) return res.status(500).send("uploaded image error");
                resolve(res.secure_url);
              });
            });
          });
      });
    };
    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();

    const urls = await Promise.all(
      arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
      })
    );
    const id = req.body.id;
    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        Product.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              product_image: urls,
            },
          }
        )
          .then((data) => {
            req.session.productUpdated = true;
            res.redirect("/Admin/viewProductsMore/?product_id=" + req.body.id);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        res.redirect("/Admin/viewProducts");
      });
  } else {
    res.redirect("/Admin/");
  }
};
