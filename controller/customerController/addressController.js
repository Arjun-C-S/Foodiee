const { ObjectId } = require("mongodb");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");

exports.addressGet = (req, res) => {
  if(req.session.user_id) {
    Customer.find({ _id: req.session.user_id })
    .then((CustomerData) => {
      //   console.log(CustomerData[0]);
      res.render("Customer/selectAddress", {
        pageTitle: "Select Address",
        CustomerData: CustomerData,
        profile_image: req.session.profile_image,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/')
  }
  
};

exports.addAddressGet = (req, res) => {
  if(req.session.user_id) {
    if (req.query.path === "profile") {
      req.session.pathProfile = true;
      res.render("Customer/addAddress", {
        pageTitle: "Add Address",
        profile_image: req.session.profile_image,
      });
    } else {
      res.render("Customer/addAddress", {
        pageTitle: "Add Address",
        profile_image: req.session.profile_image,
      });
    }
  } else {
    res.redirect('/')
  }
  
};

exports.addAddressPost = (req, res) => {
  if(req.session.user_id) {
    Customer.findOneAndUpdate(
      { _id: req.session.user_id },
      {
        $push: {
          Address: {
            name: req.body.name,
            houseName: req.body.houseName,
            phoneNumber: req.body.phoneNumber,
            alternativePhoneNumber: req.body.alternativePhoneNumber,
            city: req.body.city,
            street: req.body.street,
            landMark: req.body.landMark,
            isActive: false,
          },
        },
      }
    )
      .then((Customerdata) => {
        if (req.session.pathProfile) {
          req.session.pathProfile = false;
          res.redirect("/Customer/editProfile");
        } else {
          res.redirect("/Customer/address");
        }
  
        // console.log("address updated");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};

exports.removeAddressGet = (req, res) => {
  if(req.session.user_id) {
    Customer.updateOne(
      {
        _id: req.session.user_id,
      },
      {
        $pull: {
          Address: { _id: req.query.address_id },
        },
      }
    )
      .then((addressRemoved) => {
        // console.log(CustomerAddressData[0].Address[0]);
        res.redirect("/Customer/editProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};

exports.editAddressGet = (req, res) => {
  if(req.session.user_id) {
    Customer.find(
      {
        $and: [
          { _id: req.session.user_id },
          { "Address._id": req.query.address_id },
        ],
      },
      { "Address.$": 1 }
    )
      .then((CustomerAddressData) => {
        // console.log(CustomerAddressData[0].Address[0]);
        res.render("Customer/editAddress", {
          pageTitle: "Edit Address",
          Address: CustomerAddressData[0].Address[0],
          profile_image: req.session.profile_image,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};

exports.editAddressPost = (req, res) => {
  if(req.session.user_id) {
    Customer.updateMany(
      {
        _id: req.session.user_id,
        "Address._id": req.body.id,
      },
      {
        $set: {
          "Address.$.name": req.body.name,
          "Address.$.houseName": req.body.houseName,
          "Address.$.phoneNumber": req.body.phoneNumber,
          "Address.$.alternativePhoneNumber": req.body.alternativePhoneNumber,
          "Address.$.city": req.body.city,
          "Address.$.street": req.body.street,
          "Address.$.landMark": req.body.landMark,
        },
      }
    )
      .then((data) => {
        res.redirect("/Customer/editProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};


exports.updateAddressPost = (req, res) => {
  if(req.session.user_id) {
    Customer.updateMany(
      {
        _id: req.session.user_id,
        "Address.isActive": true,
      },
      {
        $set: {
          "Address.$.isActive": false,
        },
      }
    )
      .then((data) => {
        Customer.updateMany(
          {
            _id: req.session.user_id,
            "Address._id": req.body.address,
          },
          {
            $set: {
              "Address.$.isActive": true,
            },
          }
        )
          .then((data) => {
            res.redirect('/Customer/cart')
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
