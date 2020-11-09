"use strict";

// const stripe = require("stripe")(config.stripeKey);
const Razorpay = require("razorpay");
const request = require("request");
const QB = require("quickblox");
const BookingPayments = require("../models/wh_booking_payments");
const CryptoJS = require("crypto-js");
const Doctordetails = require("../models/wh_doctor_details");
const instance = new Razorpay({
  key_id: `rzp_test_5G5VyL9K8BPPNJ`,
  key_secret: `Ynzgwz8hhTezffS3cG1iiDWk`,
});

const otpData = [];
const now = new Date();
const timestamp = now.setMinutes(now.getMinutes() - 30); // timestamp
const createQuickBlox = async function (obj) {
  try {
    const QBcredentials = {
      application_id: 85060,
      auth_key: "Hu527uvYdY7GfyT",
      nonce: Math.floor(1000 + Math.random() * 9000),
      authSecret: "a2EvU4g3E-cju3F",
      timestamp: parseInt(Math.round(timestamp / 1000)),
    };
    const signData = `application_id=${QBcredentials.application_id}&auth_key=${QBcredentials.auth_key}&nonce=${QBcredentials.nonce}&timestamp=${QBcredentials.timestamp}`;
    const signature = CryptoJS.HmacSHA1(signData, QBcredentials.authSecret);
    QB.users.create({ login: obj.username, password: "password" }, function (
      err,
      res
    ) {
      if (err) {
        done.fail("Create user error: " + JSON.stringify(err));
      } else {
        console.log(res, "hdfjhdjfhjd");
      }
    });
    // return request(
    //   {
    //     method: "POST",
    //     url: `https://api.quickblox.com/session.json`,
    //     form: {
    //       ...QBcredentials,
    //       signature: signature.toString(),
    //     },
    //   },
    //   async function (err, response, body) {
    //     console.log(err, response, body, "err, response, body");
    //     if (err) {
    //       return {
    //         message: "Something Went Wrong",
    //       };
    //     }
    //     console.log("createQuickBlox-response", response);
    //     console.log(
    //       "createQuickBloxheaders-headers",
    //       JSON.stringify(response.headers)
    //     );
    //     let data = JSON.parse(body);
    //     console.log("createQuickBlox-data", data);
    //     const token = (data && data.session && data.session.token) || "";
    //     console.log("createQuickBlox-token", token);

    //     return request(
    //       {
    //         method: "POST",
    //         url: `https://api.quickblox.com/users.json`,
    //         headers: {
    //           "QB-Token": token,
    //         },
    //         form: {
    //           user: {
    //             login: obj.username,
    //             password: "password",
    //           },
    //         },
    //       },
    //       async function (err, response, body) {
    //         console.log("createQuickBlox-response", response);
    //         console.log("createQuickBlox-body", body);
    //         if (err) {
    //           console.log("createQuickBlox-err", err);
    //           return {
    //             message: "Something Went Wrong",
    //           };
    //         }
    //         console.log("createQuickBlox-response", response);
    //         console.log(
    //           "createQuickBlox-response.headers",
    //           JSON.stringify(response.headers)
    //         );
    //         let data = JSON.parse(body);
    //         console.log("createQuickBlox-data", data);
    //         await Doctordetails.update(
    //           { quickblox_id: data.user.id, quickblox_login: data.user.login },
    //           {
    //             where: {
    //               user_id: obj.user_id,
    //             },
    //           }
    //         )
    //           .then((result) => {
    //             console.log("createQuickBlox-result", result);
    //           })
    //           .catch((err) => {
    //             console.log("createQuickBlox-api-err", err);
    //           });
    //         return { message: "Success" };
    //       }
    //     );
    //   }
    // );
  } catch (err) {
    console.log("createQuickBlox-catch-err", err);
  }
};
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
          return {
            message: "Something Went Wrong",
          };
        }

        let data = JSON.parse(body);
        console.log(data, "datadatadatadata");
        if (obj) {
          otpData.push(obj);
          console.log(otpData, "otpDataotpDataotpData");
        }

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
      otpData.find((otp) => {
        console.log(otp, "otpotp", obj);
        return JSON.stringify(otp) === JSON.stringify(obj);
      });
    console.log(data, "datadatadatadata", otpData);
    if (data) {
      verified = true;
      const index = otpData.findIndex(
        (data) => JSON.stringify(data) === JSON.stringify(obj)
      );
      otpData.splice(index, 1);
    }
    console.log(verified, "verified");
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
      console.log("paymentCapture-req.params", req.params);
      console.log("paymentCapture-req.body", req.body);
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
          console.log("paymentCapture-response", response);
          console.log("paymentCapture-body", body);
          if (err) {
            console.log("paymentCapture-err", err);
            return res.status(500).json({
              message: "Something Went Wrong",
            });
          }
          console.log(
            "paymentCapture-response.statusCode",
            response.statusCode
          );
          console.log(
            "paymentCapture-response.headers",
            JSON.stringify(response.headers)
          );
          let data = JSON.parse(body);
          console.log("paymentCapture-data", data);
          console.log("paymentCapture-data.status", data.status);
          if (data.status === "captured") {
            let obj = {
              amount: req.params.amount,
              payment_id: req.params.paymentId,
            };
            await BookingPayments.create(obj)
              .then((result) => {
                console.log("paymentCapture-BookingPayments-result", result);
              })
              .catch((err) => {
                console.log("paymentCapture-BookingPayments-err", err);
              });
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
      console.log("paymentCapture-err", err);
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
module.exports.sendOtp = sendOtp;
module.exports.verify = verify;
module.exports.createQuickBlox = createQuickBlox;
