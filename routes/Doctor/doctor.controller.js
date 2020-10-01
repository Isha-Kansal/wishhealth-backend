// const con = require("../../config/mysql");
const Sequelize = require("sequelize");
const Users = require("../../models/wh_users");
const Doctordetails = require("../../models/wh_doctor_details");
const Doctorlanguages = require("../../models/wh_doctor_languages");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const Languages = require("../../models/wh_languages");
const Specialities = require("../../models/wh_specialities");
const CouncilRegistration = require("../../models/wh_medical_council_registration");
const Council = require("../../models/wh_medical_council");
const Doctorqualifications = require("../../models/wh_doctor_qualifications");
const Colleges = require("../../models/wh_colleges");
const Qualifications = require("../../models/wh_qualifications");
const md5 = require("md5");
const { Op } = Sequelize;
module.exports = {
  updateDoctorDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      console.log(req.body, "reqreqreqreq");
      await Users.update(
        {
          name: req.body.name,
        },
        {
          where: {
            user_id: doctorId,
          },
        }
      );
      await Doctordetails.update(
        {
          email: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
          city: req.body.city + " " + req.body.state,
        },
        {
          where: {
            user_id: doctorId,
          },
        }
      );
      await Doctorlanguages.destroy({ where: { user_id: doctorId } }),
        req.body.languages &&
          req.body.languages.length > 0 &&
          req.body.languages.map(async (item) => {
            let language = await Languages.findOne({ where: { name: item } });
            const result = JSON.parse(JSON.stringify(language));
            console.log(result, "languagelanguagelanguage");
            let values = {
              language_id: result.id,
              user_id: doctorId,
            };

            await Doctorlanguages.create(values);
          });
      await Doctorspecialities.destroy({ where: { user_id: doctorId } }),
        req.body.specialities &&
          req.body.specialities.length > 0 &&
          req.body.specialities.map(async (item) => {
            let speciality = await Specialities.findOne({
              where: { title: item },
            });

            let values = {
              speciality_id: speciality.speciality_id,
              user_id: doctorId,
            };

            await Doctorspecialities.create(values);
          });
      return res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  searchDoctors: async function (req, res) {
    try {
      await Doctordetails.update(
        {
          password: req.body.password,
        },
        {
          where: {
            user_id: doctorId,
          },
        }
      );
      return res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },

  updatePassword: async function (req, res) {
    try {
      const doctorId = req.params.id;
      let password = md5(req.body.password);
      await Doctordetails.update(
        {
          password,
        },
        {
          where: {
            user_id: doctorId,
          },
        }
      );
      return res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getDoctorDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const rest = await Users.findOne({
        where: {
          user_id: doctorId,
        },
        attributes: ["name"],
        include: [
          {
            model: Doctordetails,
            attributes: ["email", "phone", "city", "gender", "profile_pic"],
            required: false,
          },
          {
            model: Doctorlanguages,
            attributes: ["id", "language_id"],
            required: false,
            include: [
              {
                model: Languages,
                attributes: ["name"],
                where: {
                  name: {
                    [Op.ne]: null,
                  },
                },
              },
            ],
          },
          {
            model: Doctorspecialities,
            attributes: ["id", "speciality_id"],
            required: false,
            include: [
              {
                model: Specialities,
                attributes: ["title"],
                where: {
                  title: {
                    [Op.ne]: null,
                  },
                },
              },
            ],
          },
        ],
      });
      const result = JSON.parse(JSON.stringify(rest));

      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  updateDoctorEducationDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const number = req.params.index;
      await Doctorqualifications.destroy({
        where: { user_id: doctorId, index: number },
      });

      let obj = {
        year: req.body.year,
        attachment: req.body.proof,
        degree: req.body.degree,
        college: req.body.college,
        user_id: doctorId,
        index: number,
      };
      await Doctorqualifications.create(obj);

      return res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  updateDoctorRegistrationDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const council = await Council.findOne({
        where: {
          name: req.body.council,
        },
      });
      await CouncilRegistration.destroy({
        where: { user_id: doctorId },
      });

      let obj = {
        reg_number: req.body.reg_number,
        council: council.id,
        year: req.body.year,
        reg_proof: req.body.reg_proof ? req.body.reg_proof : "",
        govt_id_proof: req.body.govt_id_proof ? req.body.govt_id_proof : "",
        user_id: doctorId,
        reg_proof_size: req.body.reg_proof_size ? req.body.reg_proof_size : "",
        govt_id_proof_size: req.body.govt_id_proof_size
          ? req.body.govt_id_proof_size
          : "",
      };
      await CouncilRegistration.create(obj);

      return res.status(200).json({
        message: "Updated Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getDoctorEducationDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const data = await Doctorqualifications.findAll({
        where: {
          user_id: doctorId,
        },
        include: [
          {
            model: Colleges,
            attributes: ["college"],
          },
          {
            model: Qualifications,
            attributes: ["degree"],
          },
        ],
      });
      console.log(data, "datadatadatadata");
      return res.status(200).json({
        data: data ? data : [],
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getDoctorRegistrationDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const data = await CouncilRegistration.findOne({
        where: {
          user_id: doctorId,
        },
        include: [{ model: Council, attributes: ["name"] }],
      });
      return res.status(200).json({
        data: data ? data : {},
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
