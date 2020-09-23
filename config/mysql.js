const mysql = require('mysql');
require('dotenv').config();

const {
	SERVER_ENVIRONMENT,

	LOCAL_DATABASE_HOST,
	LOCAL_DATABASE_USER,
	LOCAL_DATABASE_PASSWORD,

	LIVE_DATABASE_HOST,
	LIVE_DATABASE_NAME,
	LIVE_DATABASE_USER,
	LIVE_DATABASE_PASSWORD,
} = process.env;

const config =
	SERVER_ENVIRONMENT === 'local'
		? {
				host: LOCAL_DATABASE_HOST,
				user: LOCAL_DATABASE_USER,
				password: LOCAL_DATABASE_PASSWORD,
				// database: LOCAL_DATABASE_NAME,
		  }
		: {
				host: LIVE_DATABASE_HOST,
				database: LIVE_DATABASE_NAME,
				user: LIVE_DATABASE_USER,
				password: LIVE_DATABASE_PASSWORD,
		  };

const con = mysql.createConnection(config);

con.connect((err) => {
	if (err) {
		console.log('Database connection Error: ', err);
	} else {
		console.log('Successfully connected to the database.');
	}
});

let db = mysql.connection;
