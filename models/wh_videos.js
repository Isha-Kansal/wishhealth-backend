const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Videos = db.define(
  "wh_videos",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      autoIncrement: true,
      primaryKey: true,
      foreignKey: [Object],
    },
    title: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    link: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    category: {
      type: "TINYINT(3)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    status: {
      type: "TINYINT(2)",
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: ""CURRENT_TIMESTAMP"",
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: ""CURRENT_TIMESTAMP"",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Videos;
