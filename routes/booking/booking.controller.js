const Sequelize = require("sequelize");
const PatientDetails = require("../../models/wh_patient_details");

const Bookings = require("../../models/wh_patient_doctor_bookings");

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
      const patient = JSON.parse(JSON.stringify(patientData));
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${user.contact_no}&from=WishPL&templatename=Delete Appointment&var1=${booking.date2}&var2=${booking.time}&var3=${patient.name}`;
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
};
