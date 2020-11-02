const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Qualifications = require("../models/wh_qualifications");
const Colleges = require("../models/wh_colleges");
const Doctorqualifications = db.define(
  "wh_doctor_qualifications",
  {
    id: {
      type: "INT(50)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    user_id: {
      type: "INT(50)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    index: {
      type: "INT(10)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    degree: {
      // type: "VARCHAR(100)",
      type: "INT(50)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    college: {
      // type: "VARCHAR(255)",
      type: "INT(50)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    year: {
      type: "VARCHAR(50)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    attachment: {
      type: "VARCHAR(225)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    attachment_size: {
      type: "VARCHAR(15)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
Qualifications.hasOne(Doctorqualifications, { foreignKey: "degree" });

Doctorqualifications.belongsTo(Qualifications, {
  foreignKey: "degree",
});
Colleges.hasOne(Doctorqualifications, { foreignKey: "college" });

Doctorqualifications.belongsTo(Colleges, {
  foreignKey: "college",
});
module.exports = Doctorqualifications;
