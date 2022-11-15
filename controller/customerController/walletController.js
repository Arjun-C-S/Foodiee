const { ObjectId } = require("mongodb");
const Wallet = require("../../models/walletModel");

exports.walletGet = (req, res) => {
  if(req.session.user_id) {
    Wallet.aggregate([
      { $unwind: "$Transactions" },
      {
        $match: { Customer_id: ObjectId(req.session.user_id) },
      }
    ])
      .then((WalletData) => {
        // console.log(WalletData);
        res.render("Customer/wallet", {
          pageTitle: "Wallet",
          profile_image: req.session.profile_image,
          WalletData: WalletData,
          isWallet: WalletData.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/')
  }
  
};
