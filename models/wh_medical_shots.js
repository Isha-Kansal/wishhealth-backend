const Sequelize = require('sequelize');
const db = require('../config/mysql');

const MedicalShots = db.define(
	'wh_medical_shots',
	{
		id: {
			type: 'INT',
			allowNull: false,
			// defaultValue: null,
			primaryKey: true,
			foreignKey: [Object],
		},
		title: {
			type: 'VARCHAR(225)',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		description: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		image: {
			type: 'VARCHAR(225)',
			allowNull: true,
			defaultValue: '',
			primaryKey: false,
		},
		video: {
			type: 'VARCHAR(225)',
			allowNull: true,
			defaultValue: '',
			primaryKey: false,
		},
		created_at: {
			type: 'TIMESTAMP',
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			primaryKey: false,
		},
		updated_at: {
			type: 'TIMESTAMP',
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			primaryKey: false,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);

module.exports = MedicalShots;
