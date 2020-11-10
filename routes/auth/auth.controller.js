const md5 = require('md5');
const Sequelize = require('sequelize');
const Doctordetails = require('../../models/wh_doctor_details');
const { sendOtp } = require('../../common/payment');
const Users = require('../../models/wh_users');
const { Op } = Sequelize;

module.exports = {
	login: async (req, res) => {
		try {
			const { username, password, phone } = req.body;
			console.log('login-req.body', req.body);
			let data = null;
			let message = 'Not Registered';
			let status = 500;
			if (username && password) {
				const doctor = await Doctordetails.findOne({
					where: {
						username,
						password: md5(password),
					},
				});
				if (doctor) {
					data = { ...JSON.parse(JSON.stringify(doctor)) };
					message = 'login successfully';
					status = 200;
				}
			} else if (phone) {
				const user = await Users.findOne({
					where: {
						contact_no: phone,
					},
				});
				if (user) {
					const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
					const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${phone}&from=WishPL&templatename=docsignup&var1=${user.name}&var2=${otp}`;
					await sendOtp(url, {
						otp: otp.toString(),
						user_id: user.user_id,
					});
					message = 'OTP send successfully';
					status = 200;
				}
			}
			return res.status(status).json({
				data,
				status: status === 200 ? 'success' : 'fail',
				message,
			});
		} catch (err) {
			console.log('login-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	checkDocPhnMailUsrname: async (req, res) => {
		try {
			const { username, email, phone } = req.body;
			console.log('checkDocPhnMailUsrname-req.body', req.body);
			let message = 'Not Registered',
				status = 'error';
			const fields = [];
			const data = await Doctordetails.findOne({
				where: { [Op.or]: [{ username }, { email }, { phone }] },
				attributes: ['username', 'email', 'phone'],
			});

			if (data) {
				const doctor = JSON.parse(JSON.stringify(data));
				console.log('checkDocPhnMailUsrname-doctor', doctor);
				if (doctor.username === username) {
					fields.push('Username');
				}
				if (doctor.email === email) {
					fields.push('Email');
				}
				if (doctor.phone === phone) {
					fields.push('Phone');
				}
			}
			if (fields.length > 0) {
				message = fields.toString() + ' already exist';
			} else {
				status = 'success';
			}
			return res.status(200).json({ status, message });
		} catch (err) {
			console.log('checkDocPhnMailUsrname-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
