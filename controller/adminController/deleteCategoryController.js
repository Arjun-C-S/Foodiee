const Category = require("../../models/categoryModel");

exports.deletecategoryGet = (req, res) => {
    const id = req.query.id;
    Category.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
        } else {
          req.session.categoryDeleted = true;
          res.redirect("/Admin/Category");
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete User with id=" + id,
        });
      });
  };