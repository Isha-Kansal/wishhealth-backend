const mysql = require('mysql');
require('dotenv').config();
const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto-models');

const {
	// environment type
	SERVER_ENVIRONMENT,

	// local
	LOCAL_DATABASE_HOST,
	LOCAL_DATABASE_NAME,
	LOCAL_DATABASE_USER,
	LOCAL_DATABASE_PASSWORD,

	// production
	PROD_DATABASE_HOST,
	PROD_DATABASE_NAME,
	PROD_DATABASE_USER,
	PROD_DATABASE_PASSWORD,
	PROD_DATABASE_PORT,

	// uat
	UAT_DATABASE_HOST,
	UAT_DATABASE_NAME,
	UAT_DATABASE_USER,
	UAT_DATABASE_PASSWORD,
	UAT_DATABASE_PORT,
} = process.env;

const getConfig = () => {
	let cred = {
		host: LOCAL_DATABASE_HOST,
		database: LOCAL_DATABASE_NAME,
		user: LOCAL_DATABASE_USER,
		password: LOCAL_DATABASE_PASSWORD,
	};
	switch (SERVER_ENVIRONMENT) {
		case 'prod':
			cred = {
				host: PROD_DATABASE_HOST,
				database: PROD_DATABASE_NAME,
				user: PROD_DATABASE_USER,
				password: PROD_DATABASE_PASSWORD,
				port: PROD_DATABASE_PORT,
			};
			break;
		case 'uat':
			cred = {
				host: UAT_DATABASE_HOST,
				database: UAT_DATABASE_NAME,
				user: UAT_DATABASE_USER,
				password: UAT_DATABASE_PASSWORD,
				port: UAT_DATABASE_PORT,
			};
	}
	return cred;
};

const config = getConfig();
console.log('database-config', config);

const sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	port: config.port,
	dialect: 'mysql', // Type of database, because Sequelize also support MySQL
	logging: false, // Change to true if wants to see log of database
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
});

sequelize
	.authenticate()
	.then(() => {
		sequelize.sync();
		console.log(
			`Connection has been established successfully to ${config.database}`
		);
		return null;
	})
	.catch((err) => {
		console.error(`Unable to connect to the ${config.database}:`, err);
		return err;
	});

let auto = new SequelizeAuto(config.database, config.user, config.password, {
	host: config.host,
	dialect: 'mysql',
	directory: false, // prevents the program from writing to disk
	port: config.port,
	additional: {
		timestamps: false,
	},
	tables: [],
});
auto.run(function (err) {
	if (err) throw err;
	console.log('database-tables', auto.tables); // table list
	console.log('database-tables.foreignKeys', auto.foreignKeys); // foreign key list
});

module.exports = sequelize;
