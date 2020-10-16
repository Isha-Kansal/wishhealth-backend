const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Services = require("./wh_services");
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

Services.hasMany(ClinicServices, { foreignKey: "service_id" });

ClinicServices.belongsTo(Services, {
  foreignKey: "service_id",
});
module.exports = ClinicServices;
