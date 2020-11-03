const Sequelize = require("sequelize");
const db = require("../config/mysql");
const PatientUsers = require("./wh_patient_users");
const Users = require("./wh_users");

const Bookings = db.define(
  "wh_patient_doctor_bookings",
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
    clinic_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    date: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    date2: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    time: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    patient_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    codeused_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    status: {
      type: "ENUM('0','1','cancel','complete','G')",
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
    },
    user_type: {
      type: "ENUM('U','G')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    modify_by: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    booked_by: {
      type: "ENUM('patient','receptionist','doctor')",
      allowNull: false,
      defaultValue: "patient",
      primaryKey: false,
    },
    booked_category: {
      type: "VARCHAR(255)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    modified_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      primaryKey: false,
    },
    read_status: {
      type: "ENUM('0','1')",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    receptionist_id: {
      type: "INT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    type: {
      type: "VARCHAR(45)",
      allowNull: true,
      defaultValue: "clinic",
      primaryKey: false,
    },
    advance_fees: {
      type: "DECIMAL(11,2)",
      allowNull: true,
      defaultValue: "0.00",
      primaryKey: false,
    },
    doctor_confirmation: {
      type: "INT(5)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
PatientUsers.hasMany(Bookings, {
  foreignKey: "patient_id",
  sourceKey: "id",
  as: "patient_bookings",
});
Bookings.belongsTo(PatientUsers, {
  foreignKey: "patient_id",
});
module.exports = Bookings;
