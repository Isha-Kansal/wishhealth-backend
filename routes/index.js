"use strict";

const common = require("../common");
const doctor = require("./Doctor");
const patient = require("./Patient");
const search = require("./search");
const create = require("./create");
const dataValues = require("./dataValues");
const auth = require("./auth");
const s3 = require("../common/S3");
const booking = require("./booking");
module.exports = function (app) {
  app.use("/order", common);
  app.use("/doctor", doctor);
  app.use("/patient", patient);
  app.use("/search", search);
  app.use("/create", create);
  app.use("/data", dataValues);
  app.use("/auth", auth);
  app.use("/s3", s3);
  app.use("/booking", booking);
};
