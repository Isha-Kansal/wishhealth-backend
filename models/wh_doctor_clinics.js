const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Clinics = require("./wh_clinic");
const DoctorClinics = db.define(
  "wh_doctor_clinics",
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
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    invite_status: {
      type: "ENUM('sent','accepted')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    sender: {
      type: "ENUM('doctor','clinic')",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    reciever_type: {
      type: "ENUM('R','G')",
      allowNull: false,
      defaultValue: "R",
      primaryKey: false,
    },
    availability_days: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    availability_time: {
      type: "TEXT",
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
    doc_interval: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    fees: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
Clinics.hasMany(DoctorClinics, { foreignKey: "clinic_id" });
DoctorClinics.belongsTo(Clinics, {
  foreignKey: "clinic_id",
});
module.exports = DoctorClinics;
