const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Doctorlanguages = require("./wh_doctor_languages");

const Languages = db.define(
  "wh_languages",
  {
    id: {
      // type: "INT(10) UNSIGNED",
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      // autoIncrement: true,
    },
    name: {
      type: "CHAR(49)",
      allowNull: true,
      defaultValue: '',
      primaryKey: false,
    },
    "iso_639-1": {
      type: "CHAR(2)",
      allowNull: true,
      // defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Languages;
