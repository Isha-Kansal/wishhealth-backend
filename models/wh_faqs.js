const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Faqs = db.define(
  "wh_faqs",
  {
    id: {
      type: "INT(11)",
      allowNull: false,
      autoIncrement: true,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
    },
    ques: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    ans: {
      type: "TEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    likes: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    unlikes: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
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
  }
);

module.exports = Faqs;
