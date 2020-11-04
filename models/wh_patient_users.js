const Sequelize = require("sequelize");
const db = require("../config/mysql");

const PatientUsers = db.define(
  "wh_patient_users",
  {
    user_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    email: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    name: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    password: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    phone: {
      type: "VARCHAR(15)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    created_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    status: {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
    },
    quickblox_id: {
      type: "BIGINT(20)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    quickblox_login: {
      type: "VARCHAR(225)",
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
  },
  {
    timestamps: false,
  }
);

module.exports = PatientUsers;
