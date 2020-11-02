const Sequelize = require("sequelize");
const PatientDetails = require("../../models/wh_patient_details");
const Bookings = require("../../models/wh_patient_doctor_bookings");
const Users = require("../../models/wh_users");
module.exports = {
  getPatientExistence: async function (req, res) {
    try {
      console.log(req.body, "reqreqreqreq");
      const patient = await PatientDetails.findOne({
        where: {
          phone: req.body.phone,
        },
        attributes: ["name"],
      });
      return res.status(200).json({
        data: patient,
        message: patient ? "already registered" : "not registered",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getPatientBookings: async function (req, res) {
    try {
      console.log(req.body, "reqreqreqreq");
      const patient = await Bookings.findAll({
        where: {
          patient_id: req.params.patient_id,
        },
        include: [{ model: Users }],
      });
      return res.status(200).json({
        data: patient,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  patientSave: async function (req, res) {
    try {
      console.log(req.body, "reqreqreqreq");
      if (req.body.name) {
        await PatientDetails.create({
          name: req.body.name,
          phone: req.body.phone,
        });
      }

      return res.status(200).json({
        data: patient,
        message: patient ? "already registered" : "not registered",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
