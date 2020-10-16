const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Languages = require("./wh_languages");
const Users = require("./wh_users");
const Doctorlanguages = db.define(
  "wh_doctor_languages",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    user_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    language_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: NOW(),
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: NOW(),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
Languages.hasMany(Doctorlanguages, { foreignKey: "language_id" });

Doctorlanguages.belongsTo(Languages, {
  foreignKey: "language_id",
});
module.exports = Doctorlanguages;
