const Sequelize = require("sequelize");
const db = require("../config/mysql");

const BookingPayments = db.define(
  "wh_booking_payments",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    booking_id: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    payment_id: {
      type: "VARCHAR(225)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    description: {
      type: "TEXT",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    amount: {
      type: "DECIMAL(11,2)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    fees: {
      type: "DECIMAL(11,2)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    additional_charges: {
      type: "DECIMAL(11,2)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = BookingPayments;
