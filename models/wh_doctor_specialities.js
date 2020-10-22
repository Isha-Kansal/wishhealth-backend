const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Specialities = require("./wh_specialities");
const Users = require("./wh_users");

const Doctorspecialities = db.define(
  "wh_doctor_specialities",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      foreignKey: [Object],
    },
    user_id: {
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
Specialities.hasMany(Doctorspecialities, { foreignKey: "speciality_id" });

Doctorspecialities.belongsTo(Specialities, {
  foreignKey: "speciality_id",
});

module.exports = Doctorspecialities;
