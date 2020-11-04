const Sequelize = require("sequelize");
const db = require("../config/mysql");
const PatientUsers = require("./wh_patient_users");
const Users = require("./wh_users");

const BookingPrescription = db.define(
  "wh_booking_prescriptions",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    booking_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    prescription_date: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    prescription: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    modified_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = BookingPrescription;
