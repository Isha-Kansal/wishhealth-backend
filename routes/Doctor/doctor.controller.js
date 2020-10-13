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
const createController = require("../create/create.controller");
const md5 = require("md5");
const Cities = require("../../models/wh_cities");
const States = require("../../models/wh_states");
const DoctorClinicTimings = require("../../models/wh_doctor_clinic_timings");
const Clinics = require("../../models/wh_clinic");
const ClinicSpecialities = require("../../models/wh_clinic_specialities");
const ClinicServices = require("../../models/wh_clinic_services");
const Services = require("../../models/wh_services");
const ClinicTimings = require("../../models/wh_clinic_timings");
const ClinicImages = require("../../models/wh_clinic_images");
const { Op } = Sequelize;
module.exports = {
  updateDoctorDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      console.log("updateDoctorDetails", req.body, req.params);
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
          username: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
          city_id: req.body.city_id,
          state_id: req.body.state_id,
        },
        {
          where: {
            user_id: doctorId,
          },
        }
      );
      await Doctorlanguages.destroy({ where: { user_id: doctorId } });
      await createController.createLanguages(req, doctorId);
      await Doctorspecialities.destroy({ where: { user_id: doctorId } });
      await createController.createSpecialities(req, doctorId);
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
  verifyOtp: async function (req, res) {
    try {
      let message = "otp valid";
      if (req.body.otp !== "12345") {
        message = "otp invalid";
      }
      return res.status(200).json({
        message: message,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  resendOtp: async function (req, res) {
    try {
      return res.status(200).json({
        data: {
          otp: "12345",
        },
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
            attributes: [
              "email",
              "phone",
              "city_id",
              "gender",
              "profile_pic",
              "state_id",
            ],
            required: false,
            include: [{ model: Cities }, { model: States }],
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
  getDoctorClinicDetails: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const visitingClinics = await DoctorClinicTimings.findAll({
        where: {
          doctor_id: doctorId,
        },
        attributes: ["id", "clinic_id"],
        include: [
          {
            model: Clinics,
            required: false,
            include: [
              { model: ClinicTimings },
              { model: Cities },
              { model: States },
              { model: ClinicImages },
              { model: ClinicSpecialities, include: [{ model: Specialities }] },
              { model: ClinicServices, include: [{ model: Services }] },
            ],
          },
        ],
      });
      const ownClinics = await Clinics.findAll({
        where: {
          admin_id: doctorId,
        },
        include: [
          { model: ClinicTimings },
          { model: Cities },
          { model: States },
          { model: ClinicImages },
          { model: ClinicSpecialities, include: [{ model: Specialities }] },
          { model: ClinicServices, include: [{ model: Services }] },
        ],
      });

      return res.status(200).json({
        data: {
          visitingClinics,
          ownClinics,
        },
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
        attachment_size: req.body.attachment_size
          ? req.body.attachment_size
          : "",
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

  updateDoctorClinicBasic: async function (req, res) {
    try {
      await CouncilRegistration.destroy({
        where: { user_id: req.params.id },
      });
      console.log("updateDoctorRegistrationDetails", req.body);
      await createController.createRegistration(req, req.params.id);

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
      await CouncilRegistration.destroy({
        where: { user_id: req.params.id },
      });
      console.log("updateDoctorRegistrationDetails", req.body);
      await createController.createRegistration(req, req.params.id);

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
            required: true,
            attributes: ["college"],
          },
          {
            model: Qualifications,
            required: true,
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
      let data = await CouncilRegistration.findOne({
        where: {
          user_id: doctorId,
        },
        include: [{ model: Council, attributes: ["name"] }],
      });
      let finalData = JSON.parse(JSON.stringify(data));
      if (finalData && !finalData.wh_medical_council) {
        let obj = {
          name: "Delhi Medical Council",
        };

        finalData.wh_medical_council = obj;
      }
      return res.status(200).json({
        data: finalData ? finalData : {},
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
