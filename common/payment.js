"use strict";

// const stripe = require("stripe")(config.stripeKey);
const Razorpay = require("razorpay");
const request = require("request");
const BookingPayments = require("../models/wh_booking_payments");
const instance = new Razorpay({
  key_id: `rzp_test_5G5VyL9K8BPPNJ`,
  key_secret: `Ynzgwz8hhTezffS3cG1iiDWk`,
});
const otpData = [];
const sendOtp = async function (url, obj) {
  try {
    return request(
      {
        method: "GET",
        url,
      },
      async function (err, response, body) {
        console.log(err, response, body, "err, response, body");
        if (err) {
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }

        let data = JSON.parse(body);
        console.log(data, "datadatadatadata");
        otpData.push(obj);
        console.log(otpData, "otpDataotpDataotpData");
        return data.Details;
      }
    );
  } catch (err) {
    console.log(err, "err");
  }
};
const verify = async function (obj) {
  try {
    let verified = false;
    const data =
      otpData &&
      otpData.length > 0 &&
      otpData.find((data) => JSON.stringify(data) === JSON.stringify(obj));
    if (data) {
      verified = true;
      const index = otpData.findIndex(
        (data) => JSON.stringify(data) === JSON.stringify(obj)
      );
      otpData.splice(index, 1);
    }
    return verified;
  } catch (err) {
    console.log(err, "err");
  }
};
module.exports = {
  createCharge: function (req, res) {
    try {
      console.log(req.body, "req.bodyreq.body");
      const options = {
        amount: req.body.amount * 100, // amount == Rs 10
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 0,
        // 1 for automatic capture // 0 for manual capture
      };
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
        console.log(order, "orderorderorder");

        return res.status(200).json(order);
      });
    } catch (err) {
      console.log(err, "errerrerrerr");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  paymentCapture: function (req, res) {
    try {
      return request(
        {
          method: "POST",
          url: `https://${instance.key_id}:${instance.key_secret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
          form: {
            amount: req.params.amount * 100, // amount == Rs 10 // Same As Order amount
            currency: "INR",
          },
        },
        async function (err, response, body) {
          console.log(err, response, body, "err, response, body");
          if (err) {
            return res.status(500).json({
              message: "Something Went Wrong",
            });
          }
          console.log("Status:", response.statusCode);
          console.log("Headers:", JSON.stringify(response.headers));
          let data = JSON.parse(body);
          console.log("Response:", data, data.status);
          if (data.status === "captured") {
            let obj = {
              amount: req.params.amount,
              payment_id: req.params.paymentId,
            };
            await BookingPayments.create(obj);
            return res.status(200).json({
              message: "success",
            });
          }
          return res.status(400).json({
            message: "failure",
          });
        }
      );
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
module.exports.sendOtp = sendOtp;
module.exports.verify = verify;
