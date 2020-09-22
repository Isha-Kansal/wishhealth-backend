"use strict";

const auth = require("../common/payment");

module.exports = function (app) {
  app.use("/order", auth.createCharge);
  app.use("/capture/:paymentId", auth.paymentCapture);
};
