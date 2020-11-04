"use strict";
// const createError = require("http-errors");
const express = require("express");
const db = require("./config/mysql");
// const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const app = express();
require("dotenv").config();

const port = process.env.SERVER_PORT || 5000;

// body parser
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const models = require("./models/wh_booking_prescriptions");
models.sequelize.sync().then(function () {});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});
app.use(logger("dev"));

app.use(expressValidator());

app.use(expressValidator());

require("./routes")(app);
app.use((err, req, res, next) => {
  console.log("error", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// server port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
