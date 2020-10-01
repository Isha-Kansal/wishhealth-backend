const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Doctordetails = require("./wh_doctor_details");
const Doctorlanguages = require("./wh_doctor_languages");
const Doctorspecialities = require("./wh_doctor_specialities");
const Users = db.define(
  "wh_users",
  {
    user_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
    },
    name: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
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
    role: {
      type: "ENUM('patient','doctor','receptionist','pharmacist')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    contact_no: {
      type: "BIGINT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    status: {
      type: "ENUM('1','0','')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    doc_profile_status: {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
    },
    promotions: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    offers: {
      type: "VARCHAR(255)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    rankings: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
Users.hasOne(Doctordetails, { foreignKey: "user_id" });
Users.hasMany(Doctorlanguages, { foreignKey: "user_id" });
Users.hasMany(Doctorspecialities, { foreignKey: "user_id" });
module.exports = Users;
