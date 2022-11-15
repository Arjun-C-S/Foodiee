const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Customer = require("../../models/customerModel");

cloudinary.config({
  cloud_name: "dzfyfd5bg",
  api_key: "915526699138283",
  api_secret: "XHPk3ftSG8NKjQ0RnocUuYqyC08",
  secure: true,
});

exports.profileGet = (req, res) => {
  if(req.session.user_id) {
    Customer.find({ _id: req.session.user_id })
    .then((CustomerData) => {
      res.render("Customer/profile", {
        pageTitle: "Profile",
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

exports.editProfileGet = (req, res) => {
  if(req.session.user_id) {
    Customer.find({ _id: req.session.user_id })
    .then((CustomerData) => {
      res.render("Customer/editProfile", {
        pageTitle: "Edit Profile",
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
exports.editProfilePost = (req, res) => {
  if(req.session.user_id) {
    if (req.file != undefined) {
      cloudinary.uploader
        .upload(req.file.path)
        .then((result) => {
          Customer.findOneAndUpdate(
            { _id: req.session.user_id },
            {
              $set: {
                profile_image: result.secure_url,
                name: req.body.name,
                email: req.body.email,
              },
            }
          )
            .then((CustomerData) => {
              req.session.profile_image = result.secure_url;
              Customer.find({ _id: req.session.user_id })
                .then((CustomerData) => {
                  if (CustomerData[0].Address.length > 0) {
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
                            fs.unlinkSync(req.file.path);
                            req.session.profile_image =
                              CustomerData[0].profile_image;
                            res.redirect("/Customer/profile");
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    res.redirect("/Customer/profile");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              req.session.emailExists = true;
              res.redirect("/Customer/editProfile");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Customer.findOneAndUpdate(
        { _id: req.session.user_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
          },
        }
      )
        .then((CustomerData) => {
          Customer.find({ _id: req.session.user_id })
            .then((CustomerData) => {
              if (CustomerData[0].Address.length > 0) {
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
                        res.redirect("/Customer/profile");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                res.redirect("/Customer/profile");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          req.session.emailExists = true;
          res.redirect("/Customer/editProfile");
        });
    }
  } else {
    res.redirect('/')
  }
  
};
