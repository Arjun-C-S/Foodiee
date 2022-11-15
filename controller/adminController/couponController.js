const Coupon = require("../../models/couponModel");
const { ObjectId } = require("mongodb");

exports.couponGet = (req, res) => {
  if(req.session.admin) {
    Coupon.find().then((couponData) => {
      if (req.session.couponAdded) {
        req.session.couponAdded = false;
        res.render("Admin/coupon", {
          pageTitle: "Coupons",
          couponData: couponData,
          couponAdded: true,
          couponExists: false,
          couponUpdated: false,
          couponDeleted: false,
          isUpdate: false,
        });
      } else if (req.session.couponExists) {
        req.session.couponExists = false;
        res.render("Admin/coupon", {
          pageTitle: "Coupons",
          couponData: couponData,
          couponAdded: false,
          couponExists: true,
          couponUpdated: false,
          couponDeleted: false,
          isUpdate: false,
        });
      } else if (req.session.couponUpdated) {
        req.session.couponUpdated = false;
        res.render("Admin/coupon", {
          pageTitle: "Coupons",
          couponData: couponData,
          couponAdded: false,
          couponExists: false,
          couponUpdated: true,
          couponDeleted: false,
          isUpdate: false,
        });
      } else if (req.session.couponDeleted) {
        req.session.couponDeleted = false;
        res.render("Admin/coupon", {
          pageTitle: "Coupons",
          couponData: couponData,
          couponAdded: false,
          couponExists: false,
          couponUpdated: false,
          couponDeleted: true,
          isUpdate: false,
        });
      } else {
        res.render("Admin/coupon", {
          pageTitle: "Coupons",
          couponData: couponData,
          couponAdded: false,
          couponExists: false,
          couponUpdated: false,
          couponDeleted: false,
          isUpdate: false,
        });
      }
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.couponEditGet = (req, res) => {
  if(req.session.admin) {
    Coupon.find({ _id: req.query.coupon_id }).then((couponData) => {
      res.render("Admin/coupon", {
        pageTitle: "Edit Coupons",
        couponData: couponData,
        couponAdded: false,
        couponExists: false,
        couponUpdated: false,
        couponDeleted: false,
        isUpdate: true,
      });
    });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.couponPost = (req, res) => {
  if(req.session.admin) {
// new coupon offer
function idAlphabets(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function idNumbers(length) {
  let result = "";
  let characters = "1234567890";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let Coupon_id = idAlphabets(3) + idNumbers(5);
//   console.log(Coupon_id);
const coupon = new Coupon({
  Coupon_name: req.body.Coupon_Name,
  Coupon_ID: Coupon_id,
  Offer_Percentage: req.body.Coupon_Offer,
});

// save category offer in the database
coupon
  .save(coupon)
  .then((data) => {
    req.session.couponAdded = true;
    res.redirect("/Admin/coupons");
  })
  .catch((err) => {
    req.session.couponExists = true;
    res.redirect("/Admin/coupons");
  });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.couponEditPost = (req, res) => {
  if(req.session.admin) {
    const id = ObjectId(req.body.coupon_id);
    //   console.log(id);
    Coupon.findByIdAndUpdate(id, req.body)
      .then((data) => {
        req.session.couponUpdated = true;
        res.redirect("/Admin/coupons");
      })
      .catch((err) => {
        req.session.couponExists = true;
        res.redirect("/Admin/coupons");
      });
  } else {
    res.redirect('/Admin/')
  }
  
};

exports.deleteCouponGet = (req, res) => {
  if(req.session.admin) {
    const id = ObjectId(req.query.coupon_id);
    Coupon.findByIdAndDelete(id)
      .then((data) => {
        req.session.couponDeleted = true;
        res.redirect("/Admin/coupons");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};
