const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Services = db.define(
  "wh_services",
  {
    service_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    name: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    image: {
      type: "VARCHAR(225)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    priority: {
      type: "TINYINT(3)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    creation_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Services;
