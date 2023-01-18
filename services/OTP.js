const { ObjectId } = require("mongodb");
const moment = require("moment");
const Wallet = require("../models/walletModel");

exports.VerificationGet = (req, res) => {
  const dotenv = require("dotenv");
  const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );

  dotenv.config({ path: "config.env" });
  if (req.session.customer_phone) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.session.customer_phone}`,
        channel: "sms",
      })
      .then((data) => {
        res.render("Customer/verification", {
          pageTitle: "Verification",
          phone_number: req.session.customer_phone,
          invalidOTP: false,
          email: req.session.customer_email,
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
};

exports.VerificationPost = (req, res) => {
  const Customer = require("../models/customerModel");
  const dotenv = require("dotenv");
  const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );

  dotenv.config({ path: "config.env" });
  if (req.body.otp) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+91${req.body.phone}`,
        code: req.body.otp,
      })
      .then((data) => {
        function idNumbers(length) {
          let result = "";
          let characters = "1234567890";
          let charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        }

        let firstName = req.session.customer_name.split(" ")[0];
        let Referral_Code = firstName + idNumbers(5);
        // new user;
        const user = new Customer({
          name: req.session.customer_name,
          email: req.session.customer_email,
          phone: req.session.customer_phone,
          password: req.session.customer_password,
          verificationPhone: true,
          isBlocked: false,
          haveAddress: false,
          referralCode: Referral_Code,
        });
        user
          .save(user)
          .then((response) => {
            if (req.session.referrel != "") {
              Customer.find({ referralCode: req.session.referrel })
                .then((CustomerData) => {
                  Wallet.find({ Customer_id: CustomerData[0]._id })
                    .then((haveWallet) => {
                      if (haveWallet.length == 0) {
                        let transactionData = [];
                        transactionData.push({
                          Order_id: "---",
                          Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
                          Status: "CREDITED",
                          Amount: 100,
                        });
                        // console.log(productData);
                        const wallet = new Wallet({
                          Customer_id: ObjectId(CustomerData[0]._id),
                          Wallet_Total: 100,
                          Transactions: transactionData,
                        });
                        wallet
                          .save(wallet)
                          .then((data) => {
                            // console.log("wallet created");
                            Customer.find({
                              $and: [
                                {
                                  email: req.session.customer_email,
                                  phone: req.session.customer_phone,
                                },
                              ],
                            })
                              .then((CustomerData) => {
                                let transactionData = [];
                                transactionData.push({
                                  Order_id: "---",
                                  Date: moment().format(
                                    "MMMM Do YYYY, h:mm:ss a"
                                  ),
                                  Status: "CREDITED",
                                  Amount: 50,
                                });
                                const wallet = new Wallet({
                                  Customer_id: ObjectId(CustomerData[0]._id),
                                  Wallet_Total: 50,
                                  Transactions: transactionData,
                                });
                                wallet
                                  .save(wallet)
                                  .then((data) => {
                                    req.session.customer_name = false;
                                    req.session.customer_email = false;
                                    req.session.customer_phone = false;
                                    req.session.customer_password = false;
                                    req.session.referrel = false;
                                    req.session.accountCreated = true;
                                    res.redirect("/");
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
                        Wallet.findOneAndUpdate(
                          { Customer_id: CustomerData[0]._id },
                          {
                            $inc: { Wallet_Total: 100 },
                            $push: {
                              Transactions: {
                                Order_id: "---",
                                Date: moment().format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                ),
                                Status: "CREDITED",
                                Amount: 100,
                              },
                            },
                          }
                        )
                          .then((data) => {
                            Customer.find({
                              $and: [
                                {
                                  email: req.session.customer_email,
                                  phone: req.session.customer_phone,
                                },
                              ],
                            })
                              .then((CustomerData) => {
                                let transactionData = [];
                                transactionData.push({
                                  Order_id: "---",
                                  Date: moment().format(
                                    "MMMM Do YYYY, h:mm:ss a"
                                  ),
                                  Status: "CREDITED",
                                  Amount: 50,
                                });
                                const wallet = new Wallet({
                                  Customer_id: ObjectId(CustomerData[0]._id),
                                  Wallet_Total: 50,
                                  Transactions: transactionData,
                                });
                                wallet
                                  .save(wallet)
                                  .then((data) => {
                                    req.session.customer_name = false;
                                    req.session.customer_email = false;
                                    req.session.customer_phone = false;
                                    req.session.customer_password = false;
                                    req.session.referrel = false;
                                    req.session.accountCreated = true;
                                    res.redirect("/");
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
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              req.session.customer_name = false;
              req.session.customer_email = false;
              req.session.customer_phone = false;
              req.session.customer_password = false;
              req.session.referrel = false;
              req.session.accountCreated = true;
              res.redirect("/Customer/login");
            }
          })
          .catch((err) => {
            req.session.emailExists = true;
            res.redirect("/customer/signup");
          });
      })
      .catch((err) => {
        res.send(err);
        req.session.invalidOTP = true;
        // res.redirect("/Customer/verification");
      });
  }
};
