const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Services = require("./wh_services");
const DoctorServices = db.define(
  "wh_doctor_services",
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
Services.hasMany(DoctorServices, { foreignKey: "service_id" });

DoctorServices.belongsTo(Services, {
  foreignKey: "service_id",
});
module.exports = DoctorServices;
