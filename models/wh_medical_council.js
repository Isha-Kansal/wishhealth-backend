const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Council = db.define(
  "wh_medical_council",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    name: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: '',
      primaryKey: false,
    },
    status: {
      type: "TINYINT(2)",
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Council;
