var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
let db = mysql.connection;
