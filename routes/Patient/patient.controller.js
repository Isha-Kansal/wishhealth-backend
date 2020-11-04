const Sequelize = require("sequelize");
const PatientDetails = require("../../models/wh_patient_details");
const Bookings = require("../../models/wh_patient_doctor_bookings");
const Users = require("../../models/wh_users");
const Doctordetails = require("../../models/wh_doctor_details");
const Doctorqualifications = require("../../models/wh_doctor_qualifications");
const Qualifications = require("../../models/wh_qualifications");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const Specialities = require("../../models/wh_specialities");
const PatientUsers = require("../../models/wh_patient_users");
const { Op } = Sequelize;
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
      console.log("getPatientBookings-req.body", req.body);
      console.log("getPatientBookings-req.params", req.params);
      const patient = PatientUsers.findOne({
        where: {
          user_id: req.params.patient_id,
        },
        // include: [
        //   {
        //     model: Bookings,
        //     as: "patient_bookings",
        //     required: false,
        //     include: [
        //       {
        //         model: Users,
        //         include: [
        //           {
        //             model: Doctordetails,
        //             required: false,
        //           },
        //           {
        //             model: Doctorqualifications,
        //             required: false,
        //             include: [
        //               {
        //                 model: Qualifications,
        //                 required: false,
        //                 attributes: ["degree"],
        //                 where: {
        //                   degree: {
        //                     [Op.ne]: null,
        //                   },
        //                 },
        //               },
        //             ],
        //           },
        //           {
        //             model: Doctorspecialities,
        //             required: false,
        //             include: [
        //               {
        //                 model: Specialities,
        //                 required: true,
        //                 attributes: ["title"],
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // ],
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
