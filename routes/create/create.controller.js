const Sequelize = require("sequelize");
const Users = require("../../models/wh_users");
const Doctordetails = require("../../models/wh_doctor_details");
const Doctorlanguages = require("../../models/wh_doctor_languages");
const Languages = require("../../models/wh_languages");
const Specialities = require("../../models/wh_specialities");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const Doctorqualifications = require("../../models/wh_doctor_qualifications");
const sequelize = require("../../config/mysql");
const md5 = require("md5");
const Council = require("../../models/wh_medical_council");
const CouncilRegistration = require("../../models/wh_medical_council_registration");
const { Op } = sequelize;
const createSpecialities = async function (req, id) {
  try {
    req.body.specialities &&
      req.body.specialities.length > 0 &&
      req.body.specialities.map(async (item) => {
        let speciality = await Specialities.findOne({
          where: { title: item },
        });

        let values = {
          speciality_id: speciality.speciality_id,
          user_id: id,
        };

        await Doctorspecialities.create(values);
      });
  } catch (err) {
    console.log(err, "err");
  }
};

const createRegistration = async function (req, id) {
  try {
    const council = await Council.findOne({
      where: {
        name: req.body.council,
      },
    });
    let obj = {
      reg_number: req.body.reg_number,
      council: council.id,
      year: req.body.year,
      reg_proof: req.body.reg_proof ? req.body.reg_proof.uri : "",
      govt_id_proof: req.body.govt_id_proof ? req.body.govt_id_proof.uri : "",
      user_id: id,
      reg_proof_size: req.body.reg_proof_size ? req.body.reg_proof_size : "",
      govt_id_proof_size: req.body.govt_id_proof_size
        ? req.body.govt_id_proof_size
        : "",
    };
    await CouncilRegistration.create(obj);
  } catch (err) {
    console.log(err, "err");
  }
};
const createLanguages = async function (req, id) {
  try {
    req.body.languages &&
      req.body.languages.length > 0 &&
      req.body.languages.map(async (item) => {
        let language = await Languages.findOne({ where: { name: item } });
        const result = JSON.parse(JSON.stringify(language));
        console.log(result, "languagelanguagelanguage");
        let values = {
          language_id: result.id,
          user_id: id,
        };

        await Doctorlanguages.create(values);
      });
  } catch (err) {
    console.log(err, "err");
  }
};
module.exports = {
  createDoctor: async function (req, res) {
    try {
      let obj = {
        name: req.body.name,
        role: "doctor",
        contact: req.body.phone,
        status: "1",
        doc_profile_status: "1",
        offers: "",
      };
      Users.create(obj).then(async (resp) => {
        const response = JSON.parse(JSON.stringify(resp));

        let details = {
          phone: req.body.phone,
          email: req.body.email,
          password: md5(req.body.password),
          username: req.body.email,
          user_id: response.user_id,
          secondaryphone: "",
          secondaryphone_sendmess: "0",
          secretKey: md5(req.body.password),
          description: "",
          gender: "M",
          area: "",
          city: "",
          profile_pic: "",
          profile_status: "",
          doc_advance_fees: 0,
          quickblox_id: "",
          quickblox_login: "",
          degree: 0,
        };
        await Doctordetails.create(details);
        return res.status(200).json({
          data: {
            user_id: response.user_id,
            otp: "12345",
          },
          message: "Created Successfully",
        });
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  createDoctorDetails: async function (req, res) {
    try {
      await Doctordetails.update(
        {
          gender: req.body.gender,
          profile_pic: req.body.image ? req.body.image.uri : "",
          prefix: req.body.prefix,
          city_id: req.body.state_id,
          state_id: req.body.state_id,
        },
        {
          where: {
            user_id: req.body.user_id,
          },
        }
      );
      await createLanguages(req, req.body.user_id);
      await createSpecialities(req, req.body.user_id);
      return res.status(200).json({
        message: "Created Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  RegistrationDetails: async function (req, res) {
    try {
      await createRegistration(req, req.body.user_id);
      return res.status(200).json({
        message: "Created Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  EducationDetails: async function (req, res) {
    try {
      let values = {
        user_id: req.body.user_id,
        degree: req.body.degree,
        college: req.body.college,
        year: req.body.year,
        index: req.body.index,
        attachment: req.body.proof ? req.body.proof.uri : "",
        attachment_size: req.body.attachment_size
          ? req.body.attachment_size
          : "",
      };
      await Doctorqualifications.create(values);

      return res.status(200).json({
        message: "Created Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
module.exports.createLanguages = createLanguages;
module.exports.createSpecialities = createSpecialities;
module.exports.createRegistration = createRegistration;
