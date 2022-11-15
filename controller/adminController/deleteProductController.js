const Product = require("../../models/productModel");

exports.deleteProductGet = (req, res) => {
  if(req.session.admin) {
    const id = req.query.id;
    Product.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
        } else {
          req.session.productDeleted = true;
          res.redirect("/Admin/viewProducts");
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete User with id=" + id,
        });
      });
  } else {
    res.redirect('/Admin/')
  }
    
  };