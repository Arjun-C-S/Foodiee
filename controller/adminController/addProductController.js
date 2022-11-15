const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
sharp.cache(false);

const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Customer = require("../../models/customerModel");
const CategoryOffer = require("../../models/CategoryOfferModel");

exports.addProductGet = (req, res) => {
  if (req.session.admin) {
    Category.find()
      .then((response) => {
        if (req.session.productAdded) {
          req.session.productAdded = false;
          res.render("Admin/addProducts", {
            pageTitle: "Add Products",
            productAdded: true,
            productExists: false,
            isUpdate: false,
            category: response,
          });
        } else if (req.session.productExists) {
          req.session.productExists = false;
          res.render("Admin/addProducts", {
            pageTitle: "Add Products",
            productAdded: false,
            productExists: true,
            isUpdate: false,
            category: response,
          });
        } else {
          res.render("Admin/addProducts", {
            pageTitle: "Add Products",
            productAdded: false,
            productExists: false,
            isUpdate: false,
            category: response,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/Admin/");
  }
};

exports.addProductPost = async (req, res) => {
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
        fs.unlinkSync(path);
        return result;
      })
    );
    CategoryOffer.find({ Category_id: req.body.category }).then((data) => {
      if (data.length > 0) {
        const product = new Product({
          product_image: urls,
          product_name: req.body.name,
          product_description: req.body.description,
          product_price: req.body.price,
          categoryOfferPrice:
            Number(req.body.price) -
            (data[0].Offer_Percentage * Number(req.body.price)) / 100,
          productOfferPrice: req.body.price,
          product_quantity: req.body.quantity,
          Category_id: req.body.category,
        });

        // save category in the database
        product
          .save(product)
          .then((data) => {
            //res.send(data)
            req.session.productAdded = true;
            res.redirect("/Admin/addProducts");
          })
          .catch((err) => {
            req.session.productExists = true;
            res.redirect("/Admin/addProducts");
          });
      } else {
        const product = new Product({
          product_image: urls,
          product_name: req.body.name,
          product_description: req.body.description,
          product_price: req.body.price,
          categoryOfferPrice: req.body.price,
          productOfferPrice: req.body.price,
          product_quantity: req.body.quantity,
          Category_id: req.body.category,
        });

        // save category in the database
        product
          .save(product)
          .then((data) => {
            //res.send(data)
            req.session.productAdded = true;
            res.redirect("/Admin/addProducts");
          })
          .catch((err) => {
            req.session.productExists = true;
            res.redirect("/Admin/addProducts");
          });
      }
    });
  } else {
    res.redirect("/Admin/");
  }
};
