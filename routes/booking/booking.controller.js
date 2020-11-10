const Sequelize = require("sequelize");
const PatientDetails = require("../../models/wh_patient_details");
const commonController = require("../../common/payment");
const Bookings = require("../../models/wh_patient_doctor_bookings");
const Doctordetails = require("../../models/wh_doctor_details");
const Users = require("../../models/wh_users");
const Doctorqualifications = require("../../models/wh_doctor_qualifications");
const Qualifications = require("../../models/wh_qualifications");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const Specialities = require("../../models/wh_specialities");
const { Op } = Sequelize;
module.exports = {
  deleteBooking: async function (req, res) {
    try {
      const bookingData = await Bookings.findOne({
        where: { id: req.body.booking_id },
      });
      const booking = JSON.parse(JSON.stringify(bookingData));
      const patientData = await PatientDetails.findOne({
        where: { id: booking.patient_id },
      });
      const doctorData = await Doctordetails.findOne({
        where: { user_id: booking.doctor_id },
      });
      const doctor = JSON.parse(JSON.stringify(doctorData));
      const patient = JSON.parse(JSON.stringify(patientData));
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${doctor.phone}&from=WishPL&templatename=DeleteAppointment&var1=${booking.date}&var2=${booking.time}&var3=${patient.name}`;
      const session = await commonController.sendOtp(url);
      await Bookings.destroy({ where: { id: req.body.booking_id } });
      return res.status(200).json({
        message: "Deleted Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getBookingDetails: async function (req, res) {
    try {
      const bookingData = await Bookings.findOne({
        where: { id: req.params.id },
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
        ],
      });

      return res.status(200).json({
        data: bookingData,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  updateBooking: async function (req, res) {
    try {
      const bookingData = await Bookings.findOne({
        where: { id: req.body.booking_id },
      });
      const booking = JSON.parse(JSON.stringify(bookingData));
      const patientData = await PatientDetails.findOne({
        where: { id: booking.patient_id },
      });
      const doctorData = await Doctordetails.findOne({
        where: { user_id: booking.doctor_id },
      });
      const doctor = JSON.parse(JSON.stringify(doctorData));
      const patient = JSON.parse(JSON.stringify(patientData));
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${doctor.phone}&from=WishPL&templatename=DeleteAppointment&var1=${booking.date}&var2=${booking.time}&var3=${patient.name}`;
      const session = await commonController.sendOtp(url);
      await Bookings.update(
        {
          date: req.body.date,
          time: req.body.time,
          date2: new Date(req.body.date).setHours(0, 0, 0),
        },
        { where: { id: req.body.booking_id } }
      );
      return res.status(200).json({
        message: "Deleted Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
