const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Doctorlanguages = require("./wh_doctor_languages");

const Languages = db.define(
  "wh_languages",
  {
    id: {
      type: "INT(10) UNSIGNED",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
    },
    name: {
      type: "CHAR(49)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    "iso_639-1": {
      type: "CHAR(2)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
// Languages.hasMany(Doctorlanguages, {
//   foreignKey: "language_id",
//   sourceKey: "id",
//   as: "language_id",
// });
module.exports = Languages;
