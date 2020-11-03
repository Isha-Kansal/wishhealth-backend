const Sequelize = require("sequelize");
const db = require("../config/mysql");
const PatientUsers = require("../models/wh_patient_users");
const PatientDetails = db.define(
  "wh_patient_details",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    user_id: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    uniqueId: {
      type: "VARCHAR(50)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    phone: {
      type: "CHAR(20)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    email: {
      type: "VARCHAR(1150)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    gender: {
      type: "VARCHAR(50)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    dob: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    bloodGroup: {
      type: "TEXT",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    patientProfile: {
      type: "VARCHAR(100)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    patient_type: {
      type: "ENUM('U','G')",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    uniqueId_generated_by: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    name: {
      type: "VARCHAR(50)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    created_date: {
      type: "DATETIME",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    occupation: {
      type: "VARCHAR(500)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    address: {
      type: "VARCHAR(500)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    email2: {
      type: "VARCHAR(500)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    phone2: {
      type: "CHAR(20)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    age: {
      type: "VARCHAR(255)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    doctor_uniqueId: {
      type: "VARCHAR(500)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    age_conf: {
      type: "VARCHAR(255)",
      allowNull: false,
      defaultValue: null,
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
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

PatientUsers.hasOne(PatientDetails, {
  foreignKey: "user_id",
  sourceKey: "patient_id",
  as: "patient_details",
});

module.exports = PatientDetails;
