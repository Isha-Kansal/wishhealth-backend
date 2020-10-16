const Sequelize = require("sequelize");
const db = require("../config/mysql");
const Doctordetails = require("./wh_doctor_details");
const Doctorlanguages = require("./wh_doctor_languages");
const Doctorspecialities = require("./wh_doctor_specialities");
const Doctorqualifications = require("./wh_doctor_qualifications");
const DoctorClinics = require("./wh_doctor_clinics");
const DoctorClinicTimings = require("./wh_doctor_clinic_timings");
const DoctorServices = require("./wh_doctor_services");
const Bookings = require("./wh_patient_doctor_bookings");
const States = require("./wh_states");
const Cities = require("./wh_cities");
const Feedback = require("./wh_feedback");
const VideoConsultation = require("./wh_video_consultation_times");
const DoctorBankDetails = require("./wh_doctor_bank_details");
const Clinics = require("./wh_clinic");
const Users = db.define(
  "wh_users",
  {
    user_id: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      foreignKey: [Object],
      autoIncrement: true,
    },
    name: {
      type: "VARCHAR(100)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    // creation_date: {
    //   type: "DATETIME",
    //   allowNull: false,
    //   defaultValue: NOW(),
    //   primaryKey: false,
    // },
    // modified_date: {
    //   type: "DATETIME",
    //   allowNull: false,
    //   defaultValue: NOW(),
    //   primaryKey: false,
    // },
    role: {
      type: "ENUM('patient','doctor','receptionist','pharmacist')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    contact_no: {
      type: "BIGINT(11)",
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
    },
    status: {
      type: "ENUM('1','0','')",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    doc_profile_status: {
      type: "ENUM('1','0')",
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
    },
    promotions: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
    offers: {
      type: "VARCHAR(255)",
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
    },
    rankings: {
      type: "INT(11)",
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
    },
  },
  {
    timestamps: false,
  }
);
Users.hasOne(Doctordetails, { foreignKey: "user_id" });
Users.hasMany(Doctorlanguages, { foreignKey: "user_id" });
Users.hasMany(Doctorspecialities, { foreignKey: "user_id" });
Doctorspecialities.belongsTo(Users, {
  foreignKey: "user_id",
});
Users.hasMany(Doctorqualifications, { foreignKey: "user_id" });
Users.hasMany(DoctorClinics, { foreignKey: "user_id" });

Users.hasMany(DoctorClinicTimings, {
  foreignKey: "doctor_id",
  sourceKey: "user_id",
  as: "clinic_timings",
});
Users.hasMany(DoctorBankDetails, {
  foreignKey: "doctor_id",
  sourceKey: "user_id",
  as: "bank_details",
});
Users.hasMany(Clinics, {
  foreignKey: "admin_id",
  sourceKey: "user_id",
  as: "clinics",
});
Users.hasOne(VideoConsultation, {
  foreignKey: "doctor_id",
  sourceKey: "user_id",
  as: "video_timings",
});
Users.hasMany(Feedback, {
  foreignKey: "doctor_id",
  sourceKey: "user_id",
  as: "feedback",
});

Users.hasMany(Bookings, {
  foreignKey: "doctor_id",
  sourceKey: "user_id",
  as: "bookings",
});

Users.hasMany(DoctorServices, { foreignKey: "user_id" });

module.exports = Users;
