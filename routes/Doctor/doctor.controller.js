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
const commonController = require("../../common/payment");
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
const VideoConsultation = require("../../models/wh_video_consultation_times");
const DoctorBankDetails = require("../../models/wh_doctor_bank_details");
const DoctorClinics = require("../../models/wh_doctor_clinics");
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
  resendOtpSignUp: async function (req, res) {
    try {
      const otp = Math.random(10000, 99999);
      const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${req.body.phone}&from=WishPL&templatename=docsignup&var1=${req.body.name}&var2=${otp}`;
      await commonController.sendOtp(url);
      return res.status(200).json({
        data: {
          otp: "12345",
        },
        message: "Sent successfully",
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
  getDoctorTimings: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const timings = await Users.findOne({
        where: {
          user_id: doctorId,
        },
        attributes: ["user_id"],
        include: [
          {
            model: Clinics,
            required: false,
            as: "clinics",
            attributes: ["clinic_id"],
            include: [{ model: ClinicTimings, required: false }],
          },
          {
            model: Doctordetails,
            required: false,
            attributes: ["doc_advance_fees", "doc_fees"],
          },
          { model: VideoConsultation, required: false, as: "video_timings" },
          { model: DoctorBankDetails, required: false, as: "bank_details" },
        ],
      });

      return res.status(200).json({
        data: timings,
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
      const visitingClinics = await DoctorClinics.findAll({
        where: {
          user_id: doctorId,
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
  deleteDoctorEducationDetails: async function (req, res) {
    try {
      const doctorId = req.params.user_id;
      const id = req.params.id;
      await Doctorqualifications.destroy({
        where: { user_id: doctorId, id },
      });

      return res.status(200).json({
        message: "Deleted Successfully",
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
      const doctorId = req.params.user_id;
      const id = req.params.id;
      await Doctorqualifications.destroy({
        where: { user_id: doctorId, id },
      });

      let obj = {
        year: req.body.year,
        attachment: req.body.proof,
        degree: req.body.degree,
        college: req.body.college,
        user_id: doctorId,
        index: 0,
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
      const clinic = await Clinics.findOne({
        where: { admin_id: req.body.user_id, clinic_id: req.body.clinic_id },
      });
      if (clinic) {
        await Clinics.update(
          {
            name: req.body.name,
            address: req.body.address,
            city_id: req.body.city_id,
            state_id: req.body.state_id,
            pin_code: req.body.pin_code ? req.body.pin_code : "",
            clinic_type: req.body.clinic_type,
            latitude: req.body.latitude ? req.body.latitude : "",
            longitude: req.body.longitude ? req.body.longitude : "",
          },
          {
            where: {
              admin_id: req.body.user_id,
              clinic_id: req.body.clinic_id,
            },
          }
        );
        await ClinicTimings.destroy({
          where: { clinic_id: req.body.clinic_id },
        });

        if (req.body.services) {
          await ClinicServices.destroy({
            where: { clinic_id: req.body.clinic_id },
          });
          await createController.createClinicServices(req, req.body.clinic_id);
        }
        if (req.body.specialities) {
          await ClinicSpecialities.destroy({
            where: { clinic_id: req.body.clinic_id },
          });
          await createController.createClinicSpecialities(
            req,
            req.body.clinic_id
          );
        }

        await ClinicImages.destroy({
          where: { clinic_id: req.body.clinic_id },
        });
        await createController.createClinicImages(req, req.body.clinic_id);
        await createController.createClinicTimings(req, req.body.clinic_id);

        return res.status(200).json({
          message: "Updated Successfully",
        });
      }
      return res.status(200).json({
        message: "You are not admin of the clinic",
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
  leaveClinic: async function (req, res) {
    try {
      await DoctorClinicTimings.destroy({
        where: { doctor_id: req.body.user_id, clinic_id: req.body.clinic_id },
      });
      await Clinics.destroy({
        where: { admin_id: req.body.user_id, clinic_id: req.body.clinic_id },
      });
      return res.status(200).json({
        message: "Clinic Left Successfully",
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
