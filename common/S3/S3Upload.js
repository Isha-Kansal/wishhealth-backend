const AWS = require('aws-sdk');
require('dotenv').config();

const {
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_S3_BUCKET_NAME,
} = process.env;

const uploader = async (base64) => {
	try {
		if (!base64) return '';
		AWS.config.update({
			accessKeyId: AWS_ACCESS_KEY_ID,
			secretAccessKey: AWS_SECRET_ACCESS_KEY,
		});
		const s3 = new AWS.S3();
		const buffer = new Buffer.from(
			base64.replace(/^data:image\/\w+;base64,/, ''),
			'base64'
		);
		const params = {
			ACL: 'public-read',
			Body: buffer,
			Bucket: AWS_S3_BUCKET_NAME,
			ContentType: 'image/jpeg',
			Key: `${new Date().getTime() + 'doctor_image'}.${'jpeg'}`,
		};
		const data = await s3.upload(params).promise();
		return (data && data.Location) || '';
	} catch (error) {
		console.log('s3BucketUploader-try-catch', error);
		return '';
	}
};

module.exports.s3BucketUploader = uploader;
