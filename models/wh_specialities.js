const Sequelize = require("sequelize");
const db = require("../config/mysql");
const ClinicSpecialities = require("./wh_clinic_specialities");

const Specialities = db.define(
  "wh_specialities",
  {
    speciality_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    title: {
      type: "VARCHAR(250)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    status: {
      type: "TINYINT(2)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    creation_date: {
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
Specialities.hasMany(ClinicSpecialities, { foreignKey: "speciality_id" });

ClinicSpecialities.belongsTo(Specialities, {
  foreignKey: "speciality_id",
});
module.exports = Specialities;
