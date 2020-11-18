const db = require('../config/mysql');

const Blogs = db.define(
	'wp_posts',
	{
		ID: {
			type: 'BIGINT UNSIGNED',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_author: {
			type: 'BIGINT UNSIGNED',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		post_date: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00',
			primaryKey: false,
		},
		post_date_gmt: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00',
			primaryKey: false,
		},
		post_content: {
			type: 'LONGTEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_title: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_excerpt: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_status: {
			type: 'VARCHAR(20)',
			allowNull: false,
			defaultValue: 'publish',
			primaryKey: false,
		},
		comment_status: {
			type: 'VARCHAR(20)',
			allowNull: false,
			defaultValue: 'open',
			primaryKey: false,
		},
		ping_status: {
			type: 'VARCHAR(20)',
			allowNull: false,
			defaultValue: 'open',
			primaryKey: false,
		},
		post_password: {
			type: 'VARCHAR(255)',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		post_name: {
			type: 'VARCHAR(200)',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		to_ping: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		pinged: {
			type: 'TEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_modified: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00',
			primaryKey: false,
		},
		post_modified_gmt: {
			type: 'DATETIME',
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00',
			primaryKey: false,
		},
		post_content_filtered: {
			type: 'LONGTEXT',
			allowNull: false,
			defaultValue: null,
			primaryKey: false,
		},
		post_parent: {
			type: 'BIGINT UNSIGNED',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		guid: {
			type: 'VARCHAR(255)',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		menu_order: {
			type: 'INT',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
		post_type: {
			type: 'VARCHAR(20)',
			allowNull: false,
			defaultValue: 'post',
			primaryKey: false,
		},
		post_mime_type: {
			type: 'VARCHAR(100)',
			allowNull: false,
			defaultValue: '',
			primaryKey: false,
		},
		comment_count: {
			type: 'BIGINT',
			allowNull: false,
			defaultValue: '0',
			primaryKey: false,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Blogs;
