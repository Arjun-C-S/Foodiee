const { ObjectId } = require("mongodb");
const Cart = require("../../models/cartModel");
const Coupon = require("../../models/couponModel");

exports.applyCouponPost = (req, res) => {
  if(req.session.user_id) {
    Coupon.find({ Coupon_ID: req.body.coupon_code })
    .then((CouponData) => {
      //   console.log(CouponData);
      if (CouponData.length > 0) {
        let couponUsed = false;
        for (let i = 0; i < CouponData[0].Customer.length; i++) {
          if (CouponData[0].Customer[i].Customer_id.equals(ObjectId(req.session.user_id))) {
            couponUsed = true;
          }
        }
        if (couponUsed) {
          res.json({
            CouponData: "used",
          });
        } else {
          Cart.find(
            { Customer_id: ObjectId(req.session.user_id) },
            { Grand_Total: 1 }
          )
            .then((Grand_Total) => {
              Cart.findOneAndUpdate(
                { Customer_id: ObjectId(req.session.user_id) },
                {
                  $set: {
                    isCoupon: req.body.coupon_code,
                    Grand_Total:
                      Grand_Total[0].Grand_Total -
                      (Grand_Total[0].Grand_Total *
                        CouponData[0].Offer_Percentage) /
                        100,
                  },
                }
              )
                .then((data) => {
                  Coupon.findOneAndUpdate(
                    { Coupon_ID: req.body.coupon_code },
                    {
                      $push: {
                        Customer: {
                          Customer_id: ObjectId(req.session.user_id),
                        },
                      },
                    }
                  )
                    .then((data) => {
                      res.json({
                        CouponData: CouponData[0].Offer_Percentage,
                        Grand_Total: data.Grand_Total,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        res.json({
          CouponData: "empty",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.redirect('/')
  }
  
};

exports.RemoveCouponPost = (req, res) => {
  if(req.session.user_id) {
    Coupon.find({ Coupon_ID: req.body.coupon_code })
    .then((CouponData) => {
      //   console.log(CouponData);
      Cart.find(
        { Customer_id: ObjectId(req.session.user_id) },
        { Grand_Total: 1 }
      )
        .then((Grand_Total) => {
          Cart.findOneAndUpdate(
            { Customer_id: ObjectId(req.session.user_id) },
            {
              $set: {
                isCoupon: "0",
                Grand_Total:
                  (Grand_Total[0].Grand_Total * 100) /
                  CouponData[0].Offer_Percentage,
              },
            }
          )
            .then((data) => {
              // console.log(data);
              Coupon.findOneAndUpdate(
                { Coupon_ID: req.body.coupon_code },
                {
                  $pull: {
                    Customer: {
                      Customer_id: ObjectId(req.session.user_id),
                    },
                  },
                }
              ).then((data) => {
                res.json({ result: "success" });
              }).catch((err) => {
                console.log(err);
              })
            })
            .catch((err) => {
              console.log(err);
            });
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
