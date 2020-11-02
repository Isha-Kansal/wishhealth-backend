const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Council = require("./wh_medical_council");
const CouncilRegistration = db.define(
  "wh_medical_council_registration",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    user_id: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    reg_number: {
      type: "BIGINT(20)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    council: {
      type: "INT(11)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    year: {
      type: "VARCHAR(225)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    reg_proof: {
      type: "VARCHAR(225)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    govt_id_proof: {
      type: "VARCHAR(225)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    reg_proof_size: {
      type: "VARCHAR(15)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
    govt_id_proof_size: {
      type: "VARCHAR(15)",
      allowNull: false,
      // defaultValue: null,
      primaryKey: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Council.hasOne(CouncilRegistration, { foreignKey: "council" });

CouncilRegistration.belongsTo(Council, {
  foreignKey: "council",
});

module.exports = CouncilRegistration;
