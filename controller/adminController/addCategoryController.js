const Category = require("../../models/categoryModel");

exports.addCategoryGet = (req, res) => {
  if (req.session.admin) {
    if (req.session.admin) {
      if (req.query.id) {
        Category.find()
          .then((data) => {
            const id = req.query.id;
            Category.findById({ _id: id })
              .then((response) => {
                if (!response) {
                  res.status(404).send({
                    message: `Cannot Update user with ${id}. Maybe user not found!`,
                  });
                } else {
                  res.render("Admin/category", {
                    pageTitle: "Edit Category",
                    categoryExists: false,
                    categoryAdded: false,
                    categoryDeleted: false,
                    categoryUpdated: false,
                    edit_category: response,
                    category: data,
                    isUpdate: true,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                // res.redirect("/admin/update-customer");
                res
                  .status(500)
                  .send({ message: "Error Update user information" });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Category.find()
          .then((response) => {
            if (req.session.categoryAdded) {
              req.session.categoryAdded = false;
              res.render("Admin/category", {
                pageTitle: "Add Category",
                categoryExists: false,
                categoryAdded: true,
                categoryDeleted: false,
                categoryUpdated: false,
                category: response,
                isUpdate: false,
              });
            } else if (req.session.categoryExists) {
              req.session.categoryExists = false;
              res.render("Admin/category", {
                pageTitle: "Add Category",
                categoryExists: true,
                categoryAdded: false,
                categoryDeleted: false,
                categoryUpdated: false,
                category: response,
                isUpdate: false,
              });
            } else if (req.session.categoryDeleted) {
              req.session.categoryDeleted = false;
              res.render("Admin/category", {
                pageTitle: "Add Category",
                categoryExists: false,
                categoryAdded: false,
                categoryDeleted: true,
                categoryUpdated: false,
                category: response,
                isUpdate: false,
              });
            } else if (req.session.categoryUpdated) {
              req.session.categoryUpdated = false;
              res.render("Admin/category", {
                pageTitle: "Add Category",
                categoryExists: false,
                categoryAdded: false,
                categoryDeleted: false,
                categoryUpdated: true,
                category: response,
                isUpdate: false,
              });
            } else {
              res.render("Admin/category", {
                pageTitle: "Add Category",
                categoryExists: false,
                categoryAdded: false,
                categoryDeleted: false,
                categoryUpdated: false,
                category: response,
                isUpdate: false,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.redirect("/Admin/");
    }
  } else {
    res.redirect("/Admin/");
  }
};

exports.addCategoryPost = (req, res) => {
  if (req.session.admin) {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be emtpy!" });
      return;
    }

    // new category
    const category = new Category({
      Category_name: req.body.category_name,
      Category_description: req.body.category_description,
    });

    // save category in the database
    category
      .save(category)
      .then((data) => {
        //res.send(data)
        req.session.categoryAdded = true;
        res.redirect("/Admin/category");
      })
      .catch((err) => {
        req.session.categoryExists = true;
        res.redirect("/Admin/category");
      });
  } else {
    res.redirect("/Admin/");
  }
};
