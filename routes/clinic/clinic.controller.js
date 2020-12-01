const moment = require('moment');
const Sequelize = require('sequelize');
const Clinics = require('../../models/wh_clinic');
const ClinicImages = require('../../models/wh_clinic_images');
const DoctorBankDetails = require('../../models/wh_doctor_bank_details');
const DoctorClinics = require('../../models/wh_doctor_clinics');
const DoctorClinicTimings = require('../../models/wh_doctor_clinic_timings');
const DoctorDetails = require('../../models/wh_doctor_details');
const patientDoctorBookings = require('../../models/wh_patient_doctor_bookings');
const VideoConsultation = require('../../models/wh_video_consultation_times');
const { Op } = Sequelize;

module.exports = {
	doctorsAllClinics: async (req, res) => {
		try {
			const { id } = req.params;
			let doctorFees = await DoctorDetails.findOne({
				where: { user_id: id },
				attributes: ['doc_fees', 'doc_advance_fees', 'video_consultation'],
			});
			doctorFees = (doctorFees && JSON.parse(JSON.stringify(doctorFees))) || {};
			let videoConsultation = [];
			if (['1', 1].includes(doctorFees.video_consultation)) {
				const data = await VideoConsultation.findOne({
					where: { doctor_id: id },
				});
				videoConsultation = (data && JSON.parse(JSON.stringify(data))) || [];
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
			console.log('doctorClinics-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},

	clinicAvailibilityTimings: (req, res) => {
		try {
			console.log('clinicAvailibilityTimings-req.body', req.body);
			const {
				user_id,
				availability,
				vc_fees,
				vc_advance_fees,
				fees,
				advance_fees,
				account_number,
				ifsc,
				bank_acct_holder_name,
			} = req.body;

			// const clinicTimingList = (availability && JSON.parse(availability)) || [];
			const clinicTimingList = availability || [];
			const videoConsultationTimings = [],
				doctorClinicTimings = [],
				clinicIds = [];
			clinicTimingList.forEach((timing) => {
				const { break_start_time, break_end_time, clinics, day } = timing,
					doctorClinics = [];
				console.log('clinicAvailibilityTimings-clinics', clinics);
				console.log('clinicAvailibilityTimings-timing', timing);
				clinics.forEach((clinic) => {
					const { start_time, end_time, clinic_id } = clinic;
					if (clinic_id === 1) {
						const index = videoConsultationTimings.findIndex(
							(vcClinic) =>
								start_time === vcClinic.start_time &&
								end_time === vcClinic.end_time &&
								break_start_time === vcClinic.break_start_time &&
								break_end_time === vcClinic.break_end_time
						);
						if (index >= 0) {
							const clinicDay = weekDay(day);
							const beforeDays = videoConsultationTimings[index].days;
							if (!beforeDays.includes(clinicDay)) {
								videoConsultationTimings[index].days =
									beforeDays + ',' + clinicDay;
							}
						} else {
							videoConsultationTimings.push({
								...clinic,
								break_start_time,
								break_end_time,
								days: weekDay(day),
								doctor_id: user_id,
								doc_interval: '',
								fees: vc_fees,
								advance_fees: vc_advance_fees,
							});
						}
					} else {
						if (clinicIds.indexOf(clinic_id) === -1) clinicIds.push(clinic_id);
						doctorClinics.push({ ...clinic });
					}
				});
				doctorClinics &&
					doctorClinics.length > 0 &&
					doctorClinics.forEach((clinic) => {
						const timings = doctorTime({ ...clinic, ...timing });
						timings &&
							doctorClinicTimings.push({
								doctor_id: user_id,
								day: timing.day,
								clinic_id: clinic.clinic_id,
								...timings,
							});
					});
			});
			console.log(
				'clinicAvailibilityTimings-videoConsultationTimings',
				videoConsultationTimings
			);
			console.log(
				'clinicAvailibilityTimings-doctorClinicTimings',
				doctorClinicTimings
			);
			console.log('clinicAvailibilityTimings-clinicIds', clinicIds);
			// Promise.all([
			// 	VideoConsultation.destroy({ where: { doctor_id: user_id } }),
			// 	VideoConsultation.bulkCreate(videoConsultationTimings),
			// 	DoctorClinicTimings.destroy({
			// 		where: {
			// 			[Op.and]: [
			// 				{ clinic_id: { [Op.in]: clinicIds } },
			// 				{ doctor_id: user_id },
			// 			],
			// 		},
			// 	}),
			// 	DoctorClinicTimings.bulkCreate(doctorClinicTimings),
			// 	DoctorDetails.update(
			// 		{
			// 			doc_fees: parseInt(fees),
			// 			doc_advance_fees: parseInt(advance_fees),
			// 		},
			// 		{ where: { user_id } }
			// 	),
			// 	account_number &&
			// 		ifsc &&
			// 		bank_acct_holder_name &&
			// 		DoctorBankDetails.update(
			// 			{ account_number, ifsc, bank_acct_holder_name },
			// 			{ where: { doctor_id: user_id } }
			// 		),
			// ])
			// 	.then((result) => {
			// 		if (result) {
			// 			return res.status(200).json({
			// 				status: 'success',
			// 				message: 'Timings added successfully.',
			// 			});
			// 		} else {
			// 			return res.status(500).json({
			// 				message: 'Something Went Wrong',
			// 			});
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		console.log('clinicAvailibilityTimings-api-catch-err', err);
			// 		return res.status(500).json({
			// 			message: 'Something Went Wrong',
			// 		});
			// 	});
			return res.status(200).json({
				status: 'success',
				message: 'Timings added successfully.',
			});
		} catch (err) {
			console.log('clinicAvailibilityTimings-try-catch-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};

function weekDay(day) {
	switch (day) {
		case 1:
			return 'Monday';
		case 2:
			return 'Tuesday';
		case 3:
			return 'Wednesday';
		case 4:
			return 'Thursday';
		case 5:
			return 'Friday';
		case 6:
			return 'Saturday';
		case 7:
			return 'Sunday';
		default:
			return '';
	}
}

const timeSlots = [
	'00:00 AM',
	'00:30 AM',
	'01:00 AM',
	'01:30 AM',
	'02:00 AM',
	'02:30 AM',
	'03:00 AM',
	'03:30 AM',
	'04:00 AM',
	'04:30 AM',
	'05:00 AM',
	'05:30 AM',
	'06:00 AM',
	'06:30 AM',
	'07:00 AM',
	'07:30 AM',
	'08:00 AM',
	'08:30 AM',
	'09:00 AM',
	'09:30 AM',
	'10:00 AM',
	'10:30 AM',
	'11:00 AM',
	'11:30 AM',
	'12:00 PM',
	'12:30 PM',
	'01:00 PM',
	'01:30 PM',
	'02:00 PM',
	'02:30 PM',
	'03:00 PM',
	'03:30 PM',
	'04:00 PM',
	'04:30 PM',
	'05:00 PM',
	'05:30 PM',
	'06:00 PM',
	'06:30 PM',
	'07:00 PM',
	'07:30 PM',
	'08:00 PM',
	'08:30 PM',
	'09:00 PM',
	'09:30 PM',
	'10:00 PM',
	'10:30 PM',
	'11:00 PM',
	'11:30 PM',
];

function breakTimeChecker(date, type) {
	const minutes = date.format('mm');
	const isValid = ['00', '30'].includes(minutes);
	if (isValid) return date;
	if (type === 'start') {
		if (!isValid) {
			if (minutes > 30) {
				date.subtract(minutes - 30, 'minutes');
			} else {
				date.subtract(minutes, 'minutes');
			}
		}
	} else {
		if (!isValid) {
			if (minutes > 30) {
				date.add(60 - minutes, 'minutes');
			} else {
				date.add(30 - minutes, 'minutes');
			}
		}
	}
	return date;
}

function doctorTimeChecker(date, type) {
	const minutes = date.format('mm');
	const isValid = ['00', '30'].includes(minutes);
	if (isValid) return date;
	if (type === 'start') {
		if (!isValid) {
			if (minutes > 30) {
				date.add(60 - minutes, 'minutes');
			} else {
				date.add(30 - minutes, 'minutes');
			}
		}
	} else {
		if (!isValid) {
			if (minutes > 30) {
				date.subtract(minutes - 30, 'minutes');
			} else {
				date.subtract(minutes, 'minutes');
			}
		}
	}
	return date;
}

function slotGenerator(data) {
	const { startTime, endTime } = data;
	const slots = [];
	const j = moment(endTime).format();
	for (let i = moment(startTime); i.format() <= j; i = i.add(30, 'minutes')) {
		slots.push(i.format('hh:mm A'));
	}
	return slots;
}

function doctorTime(data) {
	const { start_time, end_time, break_start_time, break_end_time } = data;
	const startTime = doctorTimeChecker(moment(start_time, 'h:mma'), 'start');
	const endTime = doctorTimeChecker(moment(end_time, 'h:mma'), 'end');
	const breakStartTime = breakTimeChecker(
		moment(break_start_time, 'hh:mm a'),
		'start'
	);
	const breakEndTime = breakTimeChecker(
		moment(break_end_time, 'hh:mm a'),
		'end'
	);
	console.log('startTime', startTime);
	console.log('endTime', endTime);
	console.log('breakStartTime', breakStartTime);
	console.log('breakEndTime', breakEndTime);
	if (breakStartTime.format() > breakEndTime.format()) return false;

	const isBeakExist =
		breakStartTime.isBetween(startTime, endTime) &&
		breakEndTime.isBetween(startTime, endTime);
	console.log('isBeakExist', isBeakExist);
	const availableSlots = [];
	if (isBeakExist) {
		availableSlots.push(
			...slotGenerator({ startTime, endTime: breakStartTime }),
			...slotGenerator({ startTime: breakEndTime, endTime })
		);
		availableSlots.push(...slotGenerator({ startTime: breakEndTime, endTime }));
	} else {
		const breakAtStart = break_start_time === startTime.format('hh:mm a');
		console.log('breakAtStart', breakAtStart, break_start_time);
		const breakAtEnd = break_end_time === endTime.format('hh:mm a');
		console.log('breakAtEnd', breakAtEnd, break_end_time);
		const i = moment(startTime);
		const j = moment(endTime);
		if (breakAtStart) {
			const minutes = minuteCalculator(
				new Date(breakStartTime.format()),
				new Date(breakEndTime.format())
			);
			i.add(minutes, 'minutes');
		}
		if (breakAtEnd) {
			const minutes = minuteCalculator(
				new Date(breakStartTime.format()),
				new Date(breakEndTime.format())
			);
			j.subtract(minutes, 'minutes');
		}
		const isBreakStartTimeBeforeStartTime = breakStartTime.isBefore(startTime);
		const isBreakEndTimeAfterEndTime = breakEndTime.isAfter(endTime);
		if (isBreakStartTimeBeforeStartTime && isBreakEndTimeAfterEndTime) {
			return false;
		} else if (isBreakStartTimeBeforeStartTime) {
			const minutes = minuteCalculator(
				new Date(startTime.format()),
				new Date(breakEndTime.format())
			);
			i.add(minutes, 'minutes');
		} else if (isBreakEndTimeAfterEndTime) {
			const minutes = minuteCalculator(
				new Date(breakStartTime.format()),
				new Date(endTime.format())
			);
			j.subtract(minutes, 'minutes');
		}
		availableSlots.push(...slotGenerator({ startTime: i, endTime: j }));
	}
	const obj = {};
	timeSlots.forEach((slot) => {
		if (availableSlots.includes(slot)) obj[slot] = '1';
		else obj[slot] = '0';
	});
	return obj;
}

function minuteCalculator(startDate, endDate) {
	const ticks = (endDate - startDate) / 1000;
	const seconds = Math.abs(ticks);
	const minutes = seconds / 60;
	return minutes;
}
