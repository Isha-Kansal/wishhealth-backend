const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Cities = require("./wh_cities");

const States = db.define(
  "wh_states",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      autoIncrement: true,
      primaryKey: true,
      foreignKey: [Object],
    },
    name: {
      type: "VARCHAR(30)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
States.hasMany(Cities, {
  foreignKey: "state_id",
  sourceKey: "id",
  as: "state",
});

module.exports = States;
