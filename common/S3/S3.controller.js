const Doctordetails = require('../../models/wh_doctor_details');
const { s3BucketUploader } = require('./S3Upload');

module.exports = {
	uploadImage: async function (req, res) {
		try {
			const doctorId = req.params.id || '';
			console.log('uploadDoctorImage-req.body', req.body);
			console.log('uploadDoctorImage-req.params', req.params);
			const { base64 } = req.body;
			const url = await s3BucketUploader(base64);
			if (!url) {
				return res.status(500).json({
					message: 'Something Went Wrong',
				});
			}
			if (doctorId) {
				console.log('uploadImage-doctorId', doctorId);
				await Doctordetails.update(
					{
						profile_pic: url,
					},
					{
						where: {
							user_id: doctorId,
						},
					}
				);
			}
			return res.status(200).json({
				message: 'Doctor profile uploaded successfully.',
				data: { url },
			});
		} catch (err) {
			console.log('uploadDoctorImage-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
