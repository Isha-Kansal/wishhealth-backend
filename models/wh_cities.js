const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Clinics = require("./wh_clinic");
const States = require("./wh_states");
const Users = require("./wh_users");

const Cities = db.define(
  "wh_cities",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    name: {
      type: "VARCHAR(30)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    state_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Cities;
