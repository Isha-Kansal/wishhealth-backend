const Sequelize = require('sequelize');
const Qualifications = require('../../models/wh_qualifications');
const Colleges = require('../../models/wh_colleges');
const States = require('../../models/wh_states');
const Cities = require('../../models/wh_cities');
const Languages = require('../../models/wh_languages');
const Specialities = require('../../models/wh_specialities');
const Services = require('../../models/wh_services');
const Videos = require('../../models/wh_videos');
const Faqs = require('../../models/wh_faqs');
const Testimonials = require('../../models/wh_testimonials');
const Council = require('../../models/wh_medical_council');
const MedicalShots = require('../../models/wh_medical_shots');
const Blogs = require('../../models/wp_posts');

module.exports = {
	getDegrees: async function (req, res) {
		try {
			const degree = await Qualifications.findAll({});
			const colleges = await Colleges.findAll({});
			return res.status(200).json({
				data: {
					degree,
					colleges,
				},
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getColleges: async function (req, res) {
		try {
			const colleges = await Colleges.findAll({});
			return res.status(200).json({
				data: colleges,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getStates: async function (req, res) {
		try {
			const states = await States.findAll({});
			return res.status(200).json({
				data: states,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getCities: async function (req, res) {
		try {
			const cities = await Cities.findAll({
				where: {
					state_id: req.params.state_id,
				},
			});
			return res.status(200).json({
				data: cities,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getLanguages: async function (req, res) {
		try {
			const languages = await Languages.findAll({});
			return res.status(200).json({
				data: languages,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getSpecialities: async function (req, res) {
		try {
			const specialities = await Specialities.findAll({});
			return res.status(200).json({
				data: specialities,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getServices: async function (req, res) {
		try {
			const services = await Services.findAll({});
			return res.status(200).json({
				data: services,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getVideos: async function (req, res) {
		try {
			const videos = await Videos.findAll({});
			return res.status(200).json({
				data: videos,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getFaqs: async function (req, res) {
		try {
			const faqs = await Faqs.findAll({});
			return res.status(200).json({
				data: faqs,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getTestimonials: async function (req, res) {
		try {
			const testimonials = await Testimonials.findAll({});
			return res.status(200).json({
				data: testimonials,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	getCouncil: async function (req, res) {
		try {
			const council = await Council.findAll({});
			return res.status(200).json({
				data: council,
			});
		} catch (err) {
			console.log(err, 'err');
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	medicalShots: async (req, res) => {
		try {
			const medicalShots = await MedicalShots.findAll();
			return res.status(200).json({
				data: {
					medicalshot: medicalShots || [],
					message: 'List of medical shots',
					status: 'success',
				},
			});
		} catch (err) {
			console.log('medicalShots-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
	featuredBlogs: async (req, res) => {
		try {
			let blogs = [];
			await Blogs.findAll().then((result) => {
				if (result) {
					blogs = result;
				}
			});
			return res.status(200).json(blogs);
		} catch (err) {
			console.log('featuredBlogs-err', err);
			return res.status(500).json({
				message: 'Something Went Wrong',
			});
		}
	},
};
