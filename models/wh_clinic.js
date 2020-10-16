const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Cities = require("./wh_cities");
const ClinicImages = require("./wh_clinic_images");
const ClinicServices = require("./wh_clinic_services");
const ClinicSpecialities = require("./wh_clinic_specialities");
const ClinicTimings = require("./wh_clinic_timings");
const DoctorClinics = require("./wh_doctor_clinics");
const DoctorClinicTimings = require("./wh_doctor_clinic_timings");
const Bookings = require("./wh_patient_doctor_bookings");
const States = require("./wh_states");
const Clinics = db.define(
  "wh_clinic",
  {
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      autoIncrement: true,
      primaryKey: true,
      foreignKey: [Object],
    },
    name: {
      type: "VARCHAR(250)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    address: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    city: {
      type: "VARCHAR(255)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    city_id: {
      type: "INT(11)",
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
    pin_code: {
      type: "INT(8)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    days: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    start_time: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    end_time: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    break_start_time: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    break_end_time: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    admin_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    creation_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: "new Date()",
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: "new Date()",
      primaryKey: false,
    },
    image: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    doc_interval: {
      type: "INT(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    clinic_type: {
      type: "ENUM('Clinic','Organization','Hospital')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    reg_proof: {
      type: "VARCHAR(225)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    latitude: {
      type: "VARCHAR(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    longitude: {
      type: "VARCHAR(11)",
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
Clinics.hasMany(DoctorClinicTimings, { foreignKey: "clinic_id" });

DoctorClinicTimings.belongsTo(Clinics, {
  foreignKey: "clinic_id",
});
Clinics.hasMany(ClinicImages, { foreignKey: "clinic_id" });
Clinics.hasMany(ClinicTimings, { foreignKey: "clinic_id" });
Clinics.hasMany(ClinicServices, { foreignKey: "clinic_id" });
Clinics.hasMany(ClinicSpecialities, { foreignKey: "clinic_id" });
States.hasMany(Clinics, { foreignKey: "state_id" });
Clinics.hasMany(Bookings, { foreignKey: "clinic_id" });
Clinics.belongsTo(States, { foreignKey: "state_id" });

Clinics.hasMany(DoctorClinics, { foreignKey: "clinic_id" });
DoctorClinics.belongsTo(Clinics, {
  foreignKey: "clinic_id",
});
module.exports = Clinics;
