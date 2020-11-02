const Sequelize = require("sequelize");
const db = require("../config/mysql");

const ClinicImages = db.define(
  "wh_clinic_images",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      autoIncrement: true,
      primaryKey: true,
      foreignKey: [Object],
    },
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    image_url: {
      type: "VARCHAR(300)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    feature_image: {
      type: "ENUM('Y','N')",
      allowNull: false,
      defaultValue: "N",
      primaryKey: false,
    },
    creation_date: {
      type: "DATETIME",
      allowNull: true,
      // defaultValue: null,
      primaryKey: false,
    },
    modified_date: {
      type: "DATETIME",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ClinicImages;
