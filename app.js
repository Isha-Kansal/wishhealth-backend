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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token,Authorization,operation"
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
