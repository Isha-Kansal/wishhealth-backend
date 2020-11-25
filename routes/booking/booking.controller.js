const Sequelize = require('sequelize');
const PatientDetails = require('../../models/wh_patient_details');
const commonController = require('../../common/payment');
const Bookings = require('../../models/wh_patient_doctor_bookings');
const Doctordetails = require('../../models/wh_doctor_details');
const Users = require('../../models/wh_users');
const Doctorqualifications = require('../../models/wh_doctor_qualifications');
const Qualifications = require('../../models/wh_qualifications');
const Doctorspecialities = require('../../models/wh_doctor_specialities');
const Specialities = require('../../models/wh_specialities');
const Prescription = require('../../models/wh_booking_prescriptions');
const BookingPayments = require('../../models/wh_booking_payments');
const Clinics = require("../../models/wh_clinic");
const { Op } = Sequelize;
const { SERVER_ENVIRONMENT } = process.env;
module.exports = {
	deleteBooking: async function (req, res) {
		try {
			const bookingData = await Bookings.findOne({
				where: { id: req.body.booking_id },
				include: [
					{
						model: Users,
						required: true,
					},
					{
						model: PatientDetails,
						required: true,
					},
				],
			});
			const booking = JSON.parse(JSON.stringify(bookingData));

			const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${booking.wh_user.contact_no}&from=WishPL&templatename=DeleteAppointment&var1=${booking.date}&var2=${booking.time}&var3=${booking.wh_patient_detail.name}`;
			const session = await commonController.sendOtp(url);
			await Bookings.destroy({ where: { id: req.body.booking_id } });
			return res.status(200).json({
				message: 'Deleted Successfully',
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	deletePrescription: async function (req, res) {
		try {
			await Prescription.destroy({ where: { id: req.body.id } });
			return res.status(200).json({
				message: 'Deleted Successfully',
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getPrescription: async function (req, res) {
		try {
			const prescription = await Prescription.findAll({
				where: { booking_id: req.params.booking_id },
			});
			return res.status(200).json({
				data: prescription,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	paymentDetails: async function (req, res) {
		try {
			const payment = await BookingPayments.findOne({
				where: { booking_id: req.params.booking_id },
			});
			return res.status(200).json({
				data: payment,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	requestPayment: async function (req, res) {
		try {
			const { fees, additional_charges, description } = req.body;
			const bookingData = await Bookings.findOne({
				where: { id: req.params.booking_id },
				include: [
					{
						model: Users,
						required: true,
					},
					{
						model: PatientDetails,
						required: true,
					},
				],
			});
			const booking = JSON.parse(JSON.stringify(bookingData));
			const paymenturl =
				SERVER_ENVIRONMENT === 'local'
					? `www.test.wishhealth.in/patient/dashboard/myAppointment/${req.params.booking_id}`
					: `www.wishhealth.in/patient/dashboard/myAppointment/${req.params.booking_id}`;
			const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${booking.wh_patient_detail.phone}&from=WishPL&templatename=PaymentRequest&var1=${booking.wh_user.name}&var2=${booking.date}&var3=${booking.time}&var4=${paymenturl}`;
			const session = await commonController.sendOtp(url);
			await BookingPayments.create({
				booking_id: req.params.booking_id,
				fees,
				additional_charges,
				amount: parseInt(additional_charges) + parseInt(fees),
				description,
			});
			return res.status(200).json({
				data: paymenturl,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
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
										attributes: ['degree'],
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
										attributes: ['title'],
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
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	updateBooking: async function (req, res) {
		try {
			const bookingData = await Bookings.findOne({
				where: { id: req.body.booking_id },
				include: [
					{
						model: Users,
						required: true,
					},
					{
						model: PatientDetails,
						required: true,
					},
				],
			});
			const booking = JSON.parse(JSON.stringify(bookingData));

			const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${booking.wh_user.contact_no}&from=WishPL&templatename=DeleteAppointment&var1=${booking.date}&var2=${booking.time}&var3=${booking.wh_patient_detail.name}`;
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
				message: 'Deleted Successfully',
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
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
				message: 'Deleted Successfully',
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
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
				message: 'Update Successfully',
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	appointmentDetail: async (req, res) => {
		try {
			const { id } = req.params;
			const booking = await Bookings.findOne({ where: { id } });
			return res.status(200).json({
				data: booking,
			});
		} catch (err) {
			console.log('appointmentDetail-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	cashPayment: async (req, res) => {
		try {
			const { payment_id, booking_id } = req.body;
			await BookingPayments.update(
				{ payment_id },
				{
					where: { booking_id },
				}
			);
			return res.status(200).json({
				status: 'success',
				message: 'Payment add successfully.',
			});
		} catch (err) {
			console.log('cashPayment-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
