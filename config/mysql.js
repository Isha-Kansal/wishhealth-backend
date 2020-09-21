var mysql = require("mysql");

var con = mysql.createConnection({
  host: "https://uat.wishhealth.in/phpmyadmin/",
  database: "uatwishdb",
  user: "readonly",
  password: "R3@d0n1y",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
let db = mysql.connection;
