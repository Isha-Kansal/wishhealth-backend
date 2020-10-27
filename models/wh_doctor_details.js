const Sequelize = require('sequelize');
const db = require('../config/mysql');
const Cities = require('./wh_cities');
const States = require('./wh_states');
const Users = require('./wh_users');

const Doctordetails = db.define(
	'wh_doctor_details',
	{
		id: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: null,
			primaryKey: true,
			foreignKey: [Object],
			autoIncrement: true,
		},
		user_id: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		email: {
			type: 'VARCHAR(50)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		username: {
			type: 'VARCHAR(50)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		password: {
			type: 'VARCHAR(50)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		phone: {
			type: 'VARCHAR(15)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		secondaryphone: {
			type: 'VARCHAR(15)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		secondaryphone_sendmess: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		secretKey: {
			type: 'VARCHAR(50)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		description: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		gender: {
			type: "ENUM('M','F')",
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		prefix: {
			type: "ENUM('Dr.','Mr.','Mrs.','Ms.')",
			allowNull: false,
			defaultValue: 'Dr.',
			primaryKey: false,
		},
		registration_id: {
			type: 'VARCHAR(100)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		created_date: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			primaryKey: false,
		},
		modified_date: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			primaryKey: false,
		},
		profile_pic: {
			type: 'VARCHAR(100)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		phone_visible: {
			type: "ENUM('0','1')",
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		email_visible: {
			type: "ENUM('0','1')",
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		address: {
			type: 'VARCHAR(225)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		area: {
			type: 'VARCHAR(225)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		city_id: {
			type: 'INT(11)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		state_id: {
			type: 'INT(11)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		city: {
			type: 'VARCHAR(100)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		profile_status: {
			type: "ENUM('1','0','')",
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		degree: {
			type: 'VARCHAR(50)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		practice_start_year: {
			type: 'INT(4)',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		status: {
			type: "ENUM('1','0')",
			allowNull: false,
			defaultValue: '1',
			primaryKey: false,
		},
		profile_view_count: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		doc_fees: {
			type: 'INT(10)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		doc_advance_fees: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		notification: {
			type: 'TINYINT(5)',
			allowNull: false,
			defaultValue: '1',
			primaryKey: false,
		},
		show_book_appoint: {
			type: 'INT(11)',
			allowNull: true,
			defaultValue: null,
			primaryKey: false,
		},
		want_invoice_generation: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: '1',
			primaryKey: false,
		},
		askagain: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		video_consultation: {
			type: 'TINYINT(1)',
			allowNull: true,
			defaultValue: '0',
			primaryKey: false,
		},
		quickblox_id: {
			type: 'BIGINT(20)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		quickblox_login: {
			type: 'VARCHAR(225)',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		is_verified: {
			type: 'TINYINT(2)',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		blog_user_id: {
			type: 'INT(11)',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		extension: {
			type: 'VARCHAR(100)',
			// allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
	},
	{
		timestamps: false,
	}
);
// Doctordetails.hasMany(Cities, {
//   foreignKey: "city_id",
//   sourceKey: "id",
//   as: "cities",
// });
// Doctordetails.hasMany(States, {
//   foreignKey: "state_id",
//   sourceKey: "id",
//   as: "state",
// });
States.hasMany(Doctordetails, { foreignKey: 'state_id' });

Doctordetails.belongsTo(States, {
	foreignKey: 'state_id',
});
Users.hasOne(Doctordetails, { foreignKey: 'user_id' });
Cities.hasMany(Doctordetails, { foreignKey: 'city_id' });

Doctordetails.belongsTo(Cities, {
	foreignKey: 'city_id',
});
module.exports = Doctordetails;
