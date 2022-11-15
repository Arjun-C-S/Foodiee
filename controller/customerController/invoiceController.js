const { ObjectId } = require("mongodb");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");

exports.invoiceOrderGet = (req, res) => {
  if(req.session.user_id) {
    Cart.aggregate([
      { $unwind: "$Products" },
      {
        $match: { Customer_id: ObjectId(req.session.user_id) },
      },
      {
        $lookup: {
          from: "customers",
          localField: "Customer_id",
          foreignField: "_id",
          as: "cartCustomer",
        },
      },
      { $unwind: "$cartCustomer" },
      {
        $lookup: {
          from: "products",
          localField: "Products.Product_id",
          foreignField: "_id",
          as: "cartProduct",
        },
      },
      { $unwind: "$cartProduct" },
    ])
      .then((CustomerData) => {
        Customer.find({ _id: req.session.user_id })
          .then((data) => {
            // console.log(data[0].Address.length);
            if (data[0].Address.length > 0) {
              for (var i = 0; i < data[0].Address.length; i++) {
                if (data[0].Address[i].isActive == true) {
                  break;
                }
              }
              var tot_amount = 0;
              for (let j = 0; j < CustomerData.length; j++) {
                tot_amount = tot_amount + CustomerData[j].Total_Amount;
              }
              // console.log(tot_amount);
              // console.log(CustomerData);
              res.render("Customer/invoice", {
                pageTitle: "Invoice",
                CustomerData: CustomerData,
                Address: data[0].Address[i],
                Total_Amount: tot_amount,
                profile_image: req.session.profile_image,
              });
            } else {
              res.redirect('/Customer/addAddress')
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};
