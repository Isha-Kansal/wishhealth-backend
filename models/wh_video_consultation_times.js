const Sequelize = require("sequelize");
const db = require("../config/mysql");

const VideoConsultation = db.define(
  "wh_video_consultation_times",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      foreignKey: [Object],
    },
    doctor_id: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    days: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    doc_interval: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: "15",
      primaryKey: false,
    },
    start_time: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    end_time: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    break_start_time: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    break_end_time: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    fees: {
      type: "VARCHAR(45)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    advance_fees: {
      type: "VARCHAR(45)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: "new Date()",
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: "new Date()",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = VideoConsultation;
