const Clinics = require('../../models/wh_clinic');
const ClinicImages = require('../../models/wh_clinic_images');
const DoctorClinicTimings = require('../../models/wh_doctor_clinic_timings');
const DoctorDetails = require('../../models/wh_doctor_details');
const patientDoctorBookings = require('../../models/wh_patient_doctor_bookings');

module.exports = {
	doctorsAllClinics: async (req, res) => {
		try {
			const { id } = req.params;
			const doctor = await DoctorDetails.findOne({
				where: { user_id: id },
				attributes: ['doc_fees', 'doc_advance_fees'],
			});
			const doctorFees = (doctor && JSON.parse(JSON.stringify(doctor))) || {};
			const result = await Clinics.findAll({
				where: { admin_id: id },
				include: [
					{ model: ClinicImages },
					{ model: DoctorClinicTimings },
					{
						model: patientDoctorBookings,
					},
				],
			});
			const clinics = (result && JSON.parse(JSON.stringify(result))) || [];
			const timingFields = ['id', 'clinic_id', 'doctor_id', 'day'];
			for (const clinic of clinics) {
				let availability = {};
				clinic.wh_doctor_clinic_timings.forEach((timing, index) => {
					let presentTimings = Object.keys(timing).filter((time) => {
						if (!timingFields.includes(time) && timing[time] === '1') {
							return time;
						}
					});
					availability[index + 1] = presentTimings.join(',');
				});
				clinic.fees = doctorFees.doc_fees;
				clinic.advance_fees = doctorFees.doc_advance_fees;
				clinic.availability = availability;
				clinic.booked_slots = clinic.wh_patient_doctor_bookings;
				clinic.clinic_images = clinic.wh_clinic_images;

				delete clinic.wh_doctor_clinic_timings;
				delete clinic.wh_patient_doctor_bookings;
				delete clinic.wh_clinic_images;
			}
			return res.status(200).json({
				data: { response: clinics },
			});
		} catch (err) {
			console.log('doctorClinics-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
