"use strict";

const common = require("../common");
const doctor = require("./Doctor");
const patient = require("./Patient");
const search = require("./search");
module.exports = function (app) {
  app.use("/order", common);
  app.use("/doctor", doctor);
  app.use("/patient", patient);
  app.use("/search", search);
};
