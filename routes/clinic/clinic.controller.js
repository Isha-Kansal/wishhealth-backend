const Clinics = require('../../models/wh_clinic');
const ClinicTimings = require('../../models/wh_clinic_timings');
const DoctorClinicTimings = require('../../models/wh_doctor_clinic_timings');
const patientDoctorBookings = require('../../models/wh_patient_doctor_bookings');

module.exports = {
	doctorClinics: async function (req, res) {
		try {
			const { id } = req.params;
			const clinics = await Clinics.findAll({
				where: { admin_id: id },
				include: [
					{ model: DoctorClinicTimings },
					{
						model: patientDoctorBookings,
						attributes: ['id', 'doctor_id', 'clinic_id', 'date', 'time'],
					},
				],
			});
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
