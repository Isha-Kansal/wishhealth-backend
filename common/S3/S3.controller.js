const AWS = require('aws-sdk');
const Doctordetails = require('../../models/wh_doctor_details');
require('dotenv').config();

const {
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_S3_BUCKET_NAME,
} = process.env;

module.exports = {
	uploadImage: async function (req, res) {
		try {
			const doctorId = req.params.id || '';
			console.log('uploadDoctorImage-req.body', req.body);
			console.log('uploadDoctorImage-req.params', req.params);
			const { base64 } = req.body;
			AWS.config.update({
				accessKeyId: AWS_ACCESS_KEY_ID,
				secretAccessKey: AWS_SECRET_ACCESS_KEY,
			});
			const s3 = new AWS.S3();
			const buffer = new Buffer.from(
				base64.replace(/^data:image\/\w+;base64,/, ''),
				'base64'
			);
			console.log('uploadImage-buffer', buffer);
			const params = {
				ACL: 'public-read',
				Body: buffer,
				Bucket: AWS_S3_BUCKET_NAME,
				ContentType: 'image/png',
				Key: `${new Date().getTime() + 'doctor_image'}.${'png'}`,
			};
			const data = await s3.upload(params).promise();
			console.log('uploadImage-data', data);
			if (!data || !data.Location) {
				return res.status(500).json({
					message: 'Something Went Wrong',
				});
			}
			const { Location } = data;
			if (doctorId) {
				await Doctordetails.update(
					{
						profile_pic: Location,
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
				data: { url: Location },
			});
		} catch (err) {
			console.log('uploadDoctorImage-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
