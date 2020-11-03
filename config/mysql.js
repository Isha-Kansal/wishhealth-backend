const mysql = require("mysql");
require("dotenv").config();
const Sequelize = require("sequelize");
const {
  SERVER_ENVIRONMENT,
  LOCAL_DATABASE_HOST,
  LOCAL_DATABASE_USER,
  LOCAL_DATABASE_PASSWORD,
  LIVE_DATABASE_HOST,
  LIVE_DATABASE_NAME,
  LIVE_DATABASE_USER,
  LIVE_DATABASE_PASSWORD,
} = process.env;
const SequelizeAuto = require("sequelize-auto-models");
const config =
  SERVER_ENVIRONMENT === "local"
    ? {
        host: LOCAL_DATABASE_HOST,
        user: LOCAL_DATABASE_USER,
        password: LOCAL_DATABASE_PASSWORD,
      }
    : {
        host: LIVE_DATABASE_HOST,
        database: LIVE_DATABASE_NAME,
        user: LIVE_DATABASE_USER,
        password: LIVE_DATABASE_PASSWORD,
        port: 3306,
      };
console.log(config, "configconfigconfig");
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql", // Type of database, because Sequelize also support MySQL
  logging: false, // Change to true if wants to see log of database
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log(
      `Connection has been established successfully to ${config.database}`
    );
    return null;
  })
  .catch((err) => {
    console.error(`Unable to connect to the ${config.database}:`, err);
    return err;
  });
let auto = new SequelizeAuto(config.database, config.user, config.password, {
  host: config.host,
  dialect: "mysql",
  directory: false, // prevents the program from writing to disk
  port: config.port,
  additional: {
    timestamps: false,
    //...
  },
  tables: ["wh_patient_users"],
  //...
});
auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables, "dhasugdghfgdsgfhs"); // table list
  console.log(auto.foreignKeys); // foreign key list
});

module.exports = sequelize;
