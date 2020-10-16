const Sequelize = require("sequelize");
const db = require("../config/mysql");

const Testimonials = db.define(
  "wh_testimonials",
  {
    testimonial_id: {
      type: "INT(11)",
      allowNull: false,
      autoIncrement: true,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
    },
    content: {
      type: "LONGTEXT",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    client_name: {
      type: "VARCHAR(250)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    image: {
      type: "VARCHAR(225)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    video_link: {
      type: "VARCHAR(225)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    created_at: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: NOW(),
      primaryKey: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: NOW(),
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Testimonials;
