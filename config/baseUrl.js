require('dotenv').config();

module.exports = {
	apiUrl:
		process.env.SERVER_TYPE === 'prod'
			? 'https://api.prod.wishhealth.in/'
			: 'https://api.test.wishhealth.in/',
};
