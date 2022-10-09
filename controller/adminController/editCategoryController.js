const Category = require("../../models/categoryModel");

exports.editCategoryPost = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.body.id;
  console.log(id);
  Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        console.log(data);
        req.session.categoryUpdated = true;
        res.redirect("/Admin/Category");
        // res.send(data)
      }
    })
    .catch((err) => {
      req.session.categoryExists = true;
      res.redirect("/Admin/Category");
      // res.status(500).send({ message : "Error Update user information"})
    });
};
