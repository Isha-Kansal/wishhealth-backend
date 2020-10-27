const AWS = require('aws-sdk');
// var fs = require('fs');
// const config = require('../config/environment');

// module.exports = {
// 	uploadImage: async function (args) {
// 		console.log('[-] Trying to upload image...', config.S3Keys.bucket);
// 		AWS.config.update({
// 			accessKeyId: config.S3Keys.accessKeyId,
// 			secretAccessKey: config.S3Keys.secretAccessKey,
// 		});
// 		var s3bucket = new AWS.S3({ params: { Bucket: config.S3Keys.bucket } });
// 		return new Promise(function (resolve, reject) {
// 			new Promise(function (resolve, reject) {
// 				fs.readFile(args.image, function (err, file) {
// 					if (err) {
// 						return reject(err);
// 					}
// 					resolve(file);
// 				});
// 			})
// 				.then(function (data) {
// 					var fileBuffer = data;
// 					var params = {
// 						Key: args.key,
// 						Body: fileBuffer,
// 						ContentType: args.imgType,
// 						ACL: 'public-read',
// 					};

// 					return new Promise(function (resolve, reject) {
// 						s3bucket.putObject(params, function (err, imgUrl) {
// 							if (err) {
// 								return reject(err);
// 							} else {
// 								resolve(imgUrl);
// 								console.log('imgUrlimgUrl=======>>>>>>>>>', imgUrl);
// 							}
// 						});
// 					});
// 				})
// 				.then(function (imgUrl) {
// 					return resolve(args.image);
// 				})
// 				.catch(function (err) {
// 					console.log('Error in image upload : ', err);
// 					return reject(err);
// 				});
// 		});
// 	},
// };

module.exports = {
	uploadImage: async function (req, res) {
		try {
			// const doctorId = req.params.id;
			console.log('uploadDoctorImage-req.body', req.body);
			// console.log('uploadDoctorImage-req.params', req.params);
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
				Key: `${new Date().getTime() + 'image'}.${'png'}`,
			};
			const data = await s3.upload(params).promise();
			console.log('uploadImage-data', data);
			if (!data || !data.Location) {
				return res.status(500).json({
					message: 'Something Went Wrong',
				});
			}
			const { Location } = data;
			// await Doctordetails.update(
			// 	{
			// 		profile_pic: Location,
			// 	},
			// 	{
			// 		where: {
			// 			user_id: doctorId,
			// 		},
			// 	}
			// );
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
