const mysql = require('mysql');

const con = mysql.createConnection({
	host: 'https://uat.wishhealth.in/phpmyadmin/',
	database: 'uatwishdb',
	user: 'readonly',
	password: 'R3@d0n1y',
	// host: 'localhost',
	// user: 'root',
	// password: 'password',
});

con.connect((err) => {
	if (err) {
		console.log('Database Connection Error: ', err);
		throw err;
	}
	console.log('Connected!');
});

let db = mysql.connection;
