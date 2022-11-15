const Category = require("../../models/categoryModel");

exports.viewProductGet = (req, res) => {
  if(req.session.admin) {
    Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "Category_id",
          as: "Result",
        },
      },{ $unwind: '$Result' },
    ])
      .then((response) => {
        // console.log(response[0]);
        res.render("Admin/viewProducts", {
          pageTitle: "View Products",
          data: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.addProductPost = (req, res) => {};
