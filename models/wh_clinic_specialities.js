const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Specialities = require("./wh_specialities");
const States = require("./wh_states");

const ClinicSpecialities = db.define(
  "wh_clinic_specialities",
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
    speciality_id: {
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
Specialities.hasMany(ClinicSpecialities, { foreignKey: "speciality_id" });

ClinicSpecialities.belongsTo(Specialities, {
  foreignKey: "speciality_id",
});
module.exports = ClinicSpecialities;
