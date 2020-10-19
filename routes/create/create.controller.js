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
const ClinicSpecialities = require("../../models/wh_clinic_specialities");
const Services = require("../../models/wh_services");
const ClinicServices = require("../../models/wh_clinic_services");
const Clinics = require("../../models/wh_clinic");
const ClinicTimings = require("../../models/wh_clinic_timings");
const ClinicImages = require("../../models/wh_clinic_images");
const commonController = require("../../common/payment");
const { urlencoded } = require("body-parser");
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
const createClinicSpecialities = async function (req, id) {
  try {
    req.body.specialities &&
      req.body.specialities.length > 0 &&
      req.body.specialities.map(async (item) => {
        let speciality = await Specialities.findOne({
          where: { title: item },
        });

        let values = {
          speciality_id: speciality.speciality_id,
          clinic_id: id,
        };

        await ClinicSpecialities.create(values);
      });
  } catch (err) {
    console.log(err, "err");
  }
};
const createClinicTimings = async function (req, id) {
  try {
    req.body.clinic_days &&
      req.body.clinic_days.length > 0 &&
      req.body.clinic_days.map(async (item) => {
        let values = {
          ...item,
          clinic_id: id,
        };

        await ClinicTimings.create(values);
      });
  } catch (err) {
    console.log(err, "err");
  }
};
const createClinicImages = async function (req, id) {
  try {
    req.body.clinic_images &&
      req.body.clinic_images.length > 0 &&
      req.body.clinic_images.map(async (item) => {
        let values = {
          ...item,
          clinic_id: id,
        };

        await ClinicImages.create(values);
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
    console.log(council, "councilcouncilcouncil", req.body, id);
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
const createClinicServices = async function (req, id) {
  try {
    req.body.services &&
      req.body.services.length > 0 &&
      req.body.services.map(async (item) => {
        let service = await Services.findOne({ where: { name: item } });
        const result = JSON.parse(JSON.stringify(service));
        console.log(result, "languagelanguagelanguage");
        let values = {
          service_id: result.service_id,
          clinic_id: id,
        };

        await ClinicServices.create(values);
      });
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
          quickblox_id: 0,
          quickblox_login: "",
          degree: 0,
        };
        await Doctordetails.create(details);
        const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

        const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${obj.contact}&from=WishPL&templatename=docsignup&var1=${obj.name}&var2=${otp}`;
        const session = await commonController.sendOtp(url);
        console.log(session, "sessionsessionsession");
        return res.status(200).json({
          data: {
            user_id: response.user_id,
            session,
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
      const response = await Doctorqualifications.create(values);

      return res.status(200).json({
        data: {
          id: response.id,
        },
        message: "Created Successfully",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  ClinicBasic: async function (req, res) {
    try {
      let values = {
        admin_id: req.body.user_id,
        name: req.body.name,
        address: req.body.address,
        city_id: req.body.city_id,
        state_id: req.body.state_id,
        city: "",
        days: "",
        start_time: "",
        end_time: "",
        break_start_time: "",
        break_end_time: "",
        image: "",
        doc_interval: 0,
        pin_code: req.body.pin_code ? req.body.pin_code : "",
        clinic_type: req.body.clinic_type,
        latitude: req.body.latitude ? req.body.latitude : "",
        longitude: req.body.longitude ? req.body.longitude : "",
        reg_proof: req.body.reg_proof ? req.body.reg_proof.uri : "",
      };
      console.log(req.body, "req.bodyreq.bodyreq.bodyreq.body");
      Clinics.create(values).then(async (resp) => {
        const response = JSON.parse(JSON.stringify(resp));
        await createClinicTimings(req, response.clinic_id);
        console.log(
          req.body.services,
          "req.body.servicesreq.body.services",
          req.body.specialities
        );
        if (req.body.services) {
          await createClinicServices(req, response.clinic_id);
        }
        if (req.body.specialities) {
          await createClinicSpecialities(req, response.clinic_id);
        }
        if (req.body.clinic_images) {
          await createClinicImages(req, response.clinic_id);
        }
        return res.status(200).json({
          data: {
            clinic_id: response.clinic_id,
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
};
module.exports.createLanguages = createLanguages;
module.exports.createSpecialities = createSpecialities;
module.exports.createRegistration = createRegistration;
module.exports.createClinicServices = createClinicServices;
module.exports.createClinicSpecialities = createClinicSpecialities;
module.exports.createClinicTimings = createClinicTimings;
module.exports.createClinicImages = createClinicImages;
