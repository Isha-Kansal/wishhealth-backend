const Clinics = require("../../models/wh_clinic");
const ClinicImages = require("../../models/wh_clinic_images");
const DoctorClinics = require("../../models/wh_doctor_clinics");
const DoctorClinicTimings = require("../../models/wh_doctor_clinic_timings");
const DoctorDetails = require("../../models/wh_doctor_details");
const patientDoctorBookings = require("../../models/wh_patient_doctor_bookings");
const VideoConsultation = require("../../models/wh_video_consultation_times");

module.exports = {
  doctorsAllClinics: async (req, res) => {
    try {
      const { id } = req.params;
      let doctorFees = await DoctorDetails.findOne({
        where: { user_id: id },
        attributes: ["doc_fees", "doc_advance_fees", "video_consultation"],
      });
      doctorFees = (doctorFees && JSON.parse(JSON.stringify(doctorFees))) || {};
      let videoConsultation = {};
      if (["1", 1].includes(doctorFees.video_consultation)) {
        const data = await VideoConsultation.findAll({
          where: { doctor_id: id },
        });
        videoConsultation = (data && JSON.parse(JSON.stringify(data))) || {};
      }
      let joinedClinics = await DoctorClinics.findAll({
        where: { user_id: id },
        include: [
          {
            model: Clinics,
            include: [
              { model: ClinicImages },
              { model: DoctorClinicTimings },
              {
                model: patientDoctorBookings,
              },
            ],
          },
        ],
      });
      let clinics = await Clinics.findAll({
        where: { admin_id: id },
        include: [
          { model: ClinicImages },
          { model: DoctorClinicTimings },
          {
            model: patientDoctorBookings,
          },
        ],
      });
      clinics = (clinics && JSON.parse(JSON.stringify(clinics))) || [];
      joinedClinics =
        (joinedClinics && JSON.parse(JSON.stringify(joinedClinics))) || [];
      // const rejectedFields = ['id', 'clinic_id', 'doctor_id', 'day'];
      // for (const clinic of clinics) {
      // 	let availability = {};
      // 	clinic.wh_doctor_clinic_timings.forEach((timing, index) => {
      // 		let presentTimings = Object.keys(timing).filter((time) => {
      // 			if (
      // 				!rejectedFields.includes(time) &&
      // 				(timing[time] === '1' || timing[time] === 1)
      // 			) {
      // 				return time;
      // 			}
      // 		});
      // 		availability[index + 1] = presentTimings.join(',');
      // 	});
      // 	clinic.fees = doctorFees.doc_fees;
      // 	clinic.advance_fees = doctorFees.doc_advance_fees;
      // 	clinic.availability = availability;
      // 	clinic.booked_slots = clinic.wh_patient_doctor_bookings;
      // 	clinic.clinic_images = clinic.wh_clinic_images;

      // 	delete clinic.wh_doctor_clinic_timings;
      // 	delete clinic.wh_patient_doctor_bookings;
      // 	delete clinic.wh_clinic_images;
      // }
      return res.status(200).json({
        data: {
          clinics: [...clinics, ...joinedClinics],
          doctorFees,
          videoConsultation,
        },
      });
    } catch (err) {
      console.log("doctorClinics-err", err);
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  doctorsAllClinics1: async (req, res) => {
    try {
      const { id } = req.params;

      const clinics = await DoctorClinics.findAll({
        where: { user_id: id },
        // include: [
        // 	{ model: ClinicImages },
        // 	{ model: DoctorClinicTimings },
        // 	{
        // 		model: patientDoctorBookings,
        // 	},
        // ],
      });

      return res.status(200).json({
        data: { response: clinics },
      });
    } catch (err) {
      console.log("doctorClinics-err", err);
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
