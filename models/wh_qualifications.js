const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Qualifications = db.define(
  "wh_qualifications",
  {
    id: {
      type: "INT(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    degree: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    status: {
      type: "ENUM('0','1')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Qualifications;
