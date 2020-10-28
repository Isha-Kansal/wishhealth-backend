const AWS = require('aws-sdk');
const Doctordetails = require('../../models/wh_doctor_details');

module.exports = {
	uploadImage: async function (req, res) {
		try {
			const doctorId = req.params.id || '';
			console.log('uploadDoctorImage-req.body', req.body);
			console.log('uploadDoctorImage-req.params', req.params);
			const { base64 } = req.body;
			AWS.config.update({
				accessKeyId: 'AKIAVFNR42VWVSCWYXM4',
				secretAccessKey: 'LYRSrPyec7ZRqmE7ELn6GjYnH8ggGvx4v/xlt+S8',
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
				Bucket: 'wishhealth-images',
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
