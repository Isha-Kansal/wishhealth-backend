"use strict";

// const stripe = require("stripe")(config.stripeKey);
const Razorpay = require("razorpay");
const request = require("request");
const instance = new Razorpay({
  key_id: `rzp_test_5G5VyL9K8BPPNJ`,
  key_secret: `Ynzgwz8hhTezffS3cG1iiDWk`,
});

module.exports = {
  createCharge: function (req, res) {
    try {
      const options = {
        amount: 10 * 100, // amount == Rs 10
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
        return res.status(200).json(order);
      });
    } catch (err) {
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
            amount: 10 * 100, // amount == Rs 10 // Same As Order amount
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
          console.log("Response:", body);
          return res.status(200).json(body);
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
