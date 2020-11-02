const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Cities = require("./wh_cities");
const Clinics = require("./wh_clinic");
const Users = require("./wh_users");

const States = db.define(
  "wh_states",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      // autoIncrement: true,
      primaryKey: true,
      foreignKey: [Object],
    },
    name: {
      type: "VARCHAR(30)",
      allowNull: false,
      defaultValue: '',
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = States;
