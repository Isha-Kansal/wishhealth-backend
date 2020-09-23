'use strict';
// const createError = require("http-errors");
const express = require('express');
const db = require('./config/mysql');
// const cookieParser = require("cookie-parser");
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();
require('dotenv').config();

// const { checkToken } = require("./middleware");

const port = process.env.SERVER_PORT || 5000;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, x-access-token,Authorization,operation'
	);
	next();
});
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// call Authentication function
// app.use(checkToken);

// app.use("/static", express.static(__dirname + "/client"));

// api routes
// require("./routes")(app);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
	console.log('error', err);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// server port
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

module.exports = app;
