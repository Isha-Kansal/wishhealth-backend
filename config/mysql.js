const mysql = require('mysql');
require('dotenv').config();

const config =
	process.env.SERVER_TYPE === 'local'
		? {
				host: process.env.LOCAL_DATABASE_HOST,
				user: process.env.LOCAL_DATABASE_USER,
				password: process.env.LOCAL_DATABASE_PASSWORD,
				// database: process.env.LOCAL_DATABASE_NAME,
		  }
		: {
				host: process.env.LIVE_DATABASE_HOST,
				database: process.env.LIVE_DATABASE_NAME,
				user: process.env.LIVE_DATABASE_USER,
				password: process.env.LIVE_DATABASE_PASSWORD,
		  };

const con = mysql.createConnection(config);

con.connect((err) => {
	if (err) {
		console.log('Database Connection Error: ', err);
	} else {
		console.log('Connected!');
	}
});

let db = mysql.connection;
