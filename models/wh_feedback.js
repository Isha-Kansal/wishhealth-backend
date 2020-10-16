const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Feedback = db.define(
  "wh_feedback",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    appointment_id: {
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
    patient_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    recommended: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    message: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "Sequelize.NOW",
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "Sequelize.NOW",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Feedback;
