"use strict";

const common = require("../common");
const doctor = require("./Doctor");
const patient = require("./Patient");
module.exports = function (app) {
  app.use("/order", common);
  app.use("/doctor", doctor);
  app.use("/patient", patient);
};
