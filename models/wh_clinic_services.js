const Sequelize = require("sequelize");
const db = require("../config/mysql");
const States = require("./wh_states");

const ClinicServices = db.define(
  "wh_clinic_services",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      autoIncrement: true,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
    },
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    service_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    created_date: {
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
  },
  {
    timestamps: false,
  }
);
// Cities.belongsTo(States, {
//   foreignKey: "state_id",
// });
module.exports = ClinicServices;
