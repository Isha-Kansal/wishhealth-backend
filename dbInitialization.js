module.exports.initialization = (sequelize) => {
	require('./models/wh_doctor_details').sequelize.sync();
	require('./models/wh_cities').sequelize.sync();
	require('./models/wh_languages').sequelize.sync();
	require('./models/wh_services').sequelize.sync();
	require('./models/wh_states').sequelize.sync();
	require('./models/wh_clinic').sequelize.sync();
	require('./models/wh_users').sequelize.sync();
};
