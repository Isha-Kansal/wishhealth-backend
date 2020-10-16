const Sequelize = require("sequelize");
const db = require("../config/mysql");
const DoctorBankDetails = db.define(
  "wh_doctor_bank_details",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    doctor_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    account_number: {
      type: "BIGINT(20)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    ifsc: {
      type: "VARCHAR(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    bank_acct_holder_name: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "Sequelize.NOW",
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: "Sequelize.NOW",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = DoctorBankDetails;
