const Sequelize = require("sequelize");
const db = require("../config/mysql");

const ClinicTimings = db.define(
  "wh_clinic_timings",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      foreignKey: [Object],
    },
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    day: {
      type: "INT(5)",
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
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP",
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ClinicTimings;
