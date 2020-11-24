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
const Clinics = require("../../models/wh_clinic");
const commonController = require("../../common/payment");
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
      const patient = await PatientDetails.findOne({
        where: {
          id: parseInt(req.params.patient_id),
        },
        include: [
          {
            model: Bookings,
            as: "patient_bookings",
            required: false,
            include: [
              {
                model: Users,
                include: [
                  {
                    model: Doctordetails,
                    required: false,
                  },
                  {
                    model: Doctorqualifications,
                    required: false,
                    include: [
                      {
                        model: Qualifications,
                        required: false,
                        attributes: ["degree"],
                        where: {
                          degree: {
                            [Op.ne]: null,
                          },
                        },
                      },
                    ],
                  },
                  {
                    model: Doctorspecialities,
                    required: false,
                    include: [
                      {
                        model: Specialities,
                        required: true,
                        attributes: ["title"],
                      },
                    ],
                  },
                ],
              },
              {
                model: Clinics,
              },
            ],
          },
        ],
      });
      console.log(patient, "patientpatientpatientpatient");
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
  getLastBookedDoctors: async function (req, res) {
    try {
      const doctors = await Bookings.findAll({
        where: {
          patient_id: req.params.patient_id,
        },
        distinct: true,
        attributes: ["id", "doctor_id"],
        include: [
          {
            model: Users,
            required: true,
            distinct: true,
            include: [{ model: Doctordetails, required: true }],
          },
          {
            model: Clinics,
            required: false,
          },
        ],
      });
      let finalArr = [];
      for (let i = 0; i < doctors.length; i++) {
        let doctor = doctors[i];
        let index = finalArr.findIndex(function (final) {
          return final.doctor_id === doctor.doctor_id;
        });
        if (index === -1) {
          finalArr.push(doctor);
        }
      }
      return res.status(200).json({
        data: finalArr,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  updateProfile: async function (req, res) {
    try {
      await PatientDetails.update(
        {
          name: req.body.name,
          phone: req.body.phone,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${req.body.phone}&from=WishPL&templatename=otp2&var1=${otp}`;
      const session = commonController.sendOtp(url, {
        otp: otp.toString(),
        user_id: req.body.id,
      });
      return res.status(200).json({
        message: "Update Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  verifyOtp: async function (req, res) {
    try {
      let message = "otp invalid";

      const verify = await commonController.verify({
        otp: req.body.otp,
        user_id: req.body.id,
      });
      console.log("verifyOtp-verify", verify);
      if (verify) {
        message = "otp valid";
      }
      return res.status(200).json({
        message: message,
      });
    } catch (err) {
      console.log("verifyOtp-err", err);
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  patientSave: async function (req, res) {
    try {
      console.log(req.body, "reqreqreqreq");
      let patientData;
      if (req.body.name) {
        patientData = await PatientDetails.create({
          name: req.body.name,
          phone: req.body.phone,
          email: "",
          occupation: "",
          address: "",
          email2: "",
          phone: "",
          age: "",
          age_conf: "",
          quickblox_login: "",
          quickblox_id: 0,
          phone2: "",
        });
      } else {
        patientData = await PatientDetails.findOne({
          where: {
            phone: req.body.phone,
          },
        });
      }
      let patient = JSON.parse(JSON.stringify(patientData));
      if (req.body.name) {
        const quickblox = commonController.createQuickBlox({
          username: req.body.name,
          user_id: patient.id,
          type: "patient",
          qbLogin: req.body.name
        });
      }
      const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${req.body.phone}&from=WishPL&templatename=otp2&var1=${otp}`;
      const session = commonController.sendOtp(url, {
        otp: otp.toString(),
        user_id: patient.id,
      });

      return res.status(200).json({
        data: patient,
        message: "Otp Sent Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
