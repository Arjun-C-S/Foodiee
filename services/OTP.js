exports.VerificationGet = (req, res) => {
  const dotenv = require("dotenv");
  const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );

  dotenv.config({ path: "config.env" });
  if (req.query.phone) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.query.phone}`,
        channel: "sms",
      })
      .then((data) => {
        res.render("Customer/verification", {
          pageTitle: "Verification",
          phone_number: req.query.phone,
          invalidOTP: false,
          email: req.query.email,
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
        req.session.accountCreated = true;
        Customer.findOneAndUpdate(
          { email: req.body.email },
          { verificationPhone: true },
          { useFindAndModify: false }
        ).then((data) => {
          res.redirect("/");
        })
      })
      .catch((err) => {
        res.redirect("/Customer/verification");
      });
  }
};
