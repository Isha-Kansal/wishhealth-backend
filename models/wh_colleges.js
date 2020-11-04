const Sequelize = require('sequelize');
const db = require('../config/mysql');

const Colleges = db.define(
	'wh_colleges',
	{
		id: {
			type: 'INT(50)',
			allowNull: false,
			// defaultValue: null,
			primaryKey: true,
			foreignKey: [Object],
			// autoIncrement: true,
		},
		college: {
			type: 'VARCHAR(100)',
			allowNull: false,
			// defaultValue: null,
			primaryKey: false,
		},
		status: {
			type: 'TINYINT(2)',
			allowNull: false,
			defaultValue: 0,
			primaryKey: false,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Colleges;
