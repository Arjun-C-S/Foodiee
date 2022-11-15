const { ObjectId } = require("mongodb");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Customer = require("../../models/customerModel");
const Wallet = require("../../models/walletModel");

exports.selectPaymentGet = (req, res) => {
  if(req.session.user_id) {
    Cart.find({ Customer_id: req.session.user_id }, { Grand_Total: 1 }).then(
      (Grand_Total) => {
        // console.log(Grand_Total);
        Wallet.find({Customer_id: req.session.user_id})
        .then((walletData) => {
          res.render("Customer/selectPayment", {
            pageTitle: "Payment options",
            Total_Amount: Grand_Total,
            profile_image: req.session.profile_image,
            walletData: walletData,
            isWallet: walletData.length,
          });
        }).catch((err)=> {
          console.log(err);
        })
      }
    );
  } else {
    res.redirect('/')
  }
  
};

exports.selectPaymentPost = (req, res) => {};
