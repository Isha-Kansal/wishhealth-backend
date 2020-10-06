const Sequelize = require("sequelize");
const db = require("../config/mysql");

const DoctorClinicTimings = db.define(
  "wh_doctor_clinic_timings",
  {
    id: {
      type: "BIGINT(255)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    doctor_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    day: {
      type: "ENUM('1','2','3','4','5','6','7')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    "00:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "01:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "02:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "03:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "04:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "05:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "06:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "07:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "08:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "09:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "10:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "11:00 AM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "12:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "01:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "02:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "03:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "04:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "05:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "06:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "07:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "08:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "09:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "10:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    "11:00 PM": {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = DoctorClinicTimings;
