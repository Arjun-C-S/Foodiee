exports.ConfirmContactGet = (req, res) => {
  if (req.session.invalidPhoneNumber) {
    req.session.invalidPhoneNumber = false;
    res.render("Customer/ConfirmContact", {
      pageTitle: "Confirm Phone Number",
      invalidPhoneNumber: true,
    });
  } else {
    res.render("Customer/ConfirmContact", {
      pageTitle: "Confirm Phone Number",
      invalidPhoneNumber: false,
    });
  }
};

exports.ConfirmContactPost = (req, res) => {
  const Customer = require("../models/customerModel");
  console.log(req.body.phone);
  Customer.find({
    $and: [{ phone: req.body.phone }, { email: req.body.email }],
  }).then((data) => {
    console.log(data);
    if (data.length > 0) {
      res.redirect(
        "/Customer/OTPlogin?number=" +
          req.body.phone +
          "&email=" +
          req.body.email
      );
    } else {
      req.session.invalidPhoneNumber = true;
      res.redirect("/Customer/OTPlogin/ConfirmContact");
    }
  });
};

exports.OTPloginGet = (req, res) => {
  const dotenv = require("dotenv");
  const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );

  dotenv.config({ path: "config.env" });
  if (req.query.number) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.query.number}`,
        channel: "sms",
      })
      .then((data) => {
        res.render("Customer/OTPlogin", {
          pageTitle: "Forget Password",
          invalidOTP: false,
          phoneNumber: req.query.number,
          email: req.query.email,
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
};

exports.OTPloginPost = (req, res) => {
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
        Customer.find({
          $and: [{ phone: req.body.phone }, { email: req.body.email }],
        }).then((CustomerData) => {
          req.session.user_id = CustomerData[0]._id;
          res.redirect('/Customer/home');
        });
      })
      .catch((err) => {
        res.send(err);
        req.session.invalidOTP = true;
        // res.redirect("/Customer/verification");
      });
  }
};
