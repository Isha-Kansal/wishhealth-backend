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
const { s3BucketUploader } = require("../../common/S3/S3Upload");
const PatientDoctorBookings = require("../../models/wh_patient_doctor_bookings");
const Prescription = require("../../models/wh_booking_prescriptions");

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
    const reg_proof = req.body.reg_proof
      ? await s3BucketUploader(req.body.reg_proof.uri)
      : "";
    const govt_id_proof = req.body.govt_id_proof
      ? await s3BucketUploader(req.body.govt_id_proof.uri)
      : "";
    console.log("createRegistration-reg_proof", reg_proof);
    console.log("createRegistration-govt_id_proof", govt_id_proof);
    let obj = {
      reg_number: req.body.reg_number,
      council: council.id,
      year: req.body.year,
      // reg_proof: req.body.reg_proof ? req.body.reg_proof.uri : "",
      reg_proof,
      // govt_id_proof: req.body.govt_id_proof ? req.body.govt_id_proof.uri : "",
      govt_id_proof,
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
        console.log("createLanguages-find-result", result);
        let values = {
          language_id: result.id,
          user_id: id,
        };

        await Doctorlanguages.create(values)
          .then((result) => {
            console.log("createLanguages-result", result);
          })
          .catch((err) => {
            console.log("createLanguages-api-catch-err", err);
          });
      });
  } catch (err) {
    console.log("createLanguages-try-catch-err", err);
  }
};
module.exports = {
  createDoctor: async function (req, res) {
    try {
      let obj = {
        name: req.body.name,
        role: "doctor",
        contact_no: req.body.phone,
        status: "1",
        doc_profile_status: "1",
        offers: "",
      };
      Users.create(obj).then(async (resp) => {
        console.log("createDoctor-create-use-resp", resp);
        const response = JSON.parse(JSON.stringify(resp));
        console.log("createDoctor-create-user", response);
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
        await Doctordetails.create(details)
          .then((result) => {
            // you can now access the newly created user
            console.log("Doctordetails-result", result);
          })
          .catch((err) => {
            // print the error details
            console.log("Doctordetails-err", err);
          });
        const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

        const url = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=257e040b-f32f-11e8-a895-0200cd936042&to=${obj.contact_no}&from=WishPL&templatename=docsignup&var1=${obj.name}&var2=${otp}`;
        const session = commonController.sendOtp(url, {
          otp: otp.toString(),
          user_id: response.user_id,
        });
        console.log(session, "sessionsession");
        const quickblox = commonController.createQuickBlox({
          username: req.body.email,
          user_id: response.user_id,
        });
        return res.status(200).json({
          data: {
            user_id: response.user_id,
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
      console.log("createDoctorDetails-req.body", req.body);
      const profile_pic = req.body.image
        ? await s3BucketUploader(req.body.image.uri)
        : "";
      await Doctordetails.update(
        {
          gender: req.body.gender,
          profile_pic,
          prefix: req.body.prefix,
          city_id: req.body.city_id,
          state_id: req.body.state_id,
          description: req.body.description,
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
      if (req.body.practice_start_year) {
        await Doctordetails.update(
          {
            practice_start_year: req.body.practice_start_year,
          },
          {
            where: {
              user_id: req.body.user_id,
            },
          }
        );
      }
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
      console.log("EducationDetails-req.body", req.body);
      const attachment = req.body.proof
        ? await s3BucketUploader(req.body.proof.uri)
        : "";
      let values = {
        user_id: req.body.user_id,
        degree: req.body.degree,
        college: req.body.college,
        year: req.body.year,
        index: req.body.index,
        // attachment: req.body.proof ? req.body.proof.uri : "",
        attachment,
        attachment_size: req.body.attachment_size
          ? req.body.attachment_size
          : "",
      };
      console.log("EducationDetails-values", values);
      let response = "";
      await Doctorqualifications.create(values)
        .then((result) => {
          console.log("EducationDetails-result", result);
          response = JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
          console.log("EducationDetails-err", err);
        });

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
  createPrescription: async function (req, res) {
    try {
      req.body.prescriptions &&
        req.body.prescriptions.length > 0 &&
        req.body.prescriptions.map(async (data) => {
          const prescription = await s3BucketUploader(data.uri);
          let values = {
            booking_id: req.body.booking_id,
            prescription,
            prescription_date: new Date(),
          };
          console.log(req.body, "req.bodyreq.bodyreq.bodyreq.body");
          Prescription.create(values)
            .then(async (resp) => {
              const response = JSON.parse(JSON.stringify(resp));

              return res.status(200).json({
                message: "Created Successfully",
                data: response,
              });
            })
            .catch((err) => {
              console.log("createPrescription-err", err);
            });
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
      console.log("ClinicBasic-req.body", req.body);
      const reg_proof = req.body.reg_proof
        ? await s3BucketUploader(req.body.reg_proof.uri)
        : "";
      const clinic_images = req.body.clinic_images
        ? await s3BucketUploader(req.body.clinic_images.uri)
        : "";
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
        image: clinic_images,
        doc_interval: 0,
        pin_code: req.body.pin_code ? req.body.pin_code : "",
        clinic_type: req.body.clinic_type,
        latitude: req.body.latitude ? req.body.latitude : "",
        longitude: req.body.longitude ? req.body.longitude : "",
        // reg_proof: req.body.reg_proof ? req.body.reg_proof.uri : "",
        reg_proof,
      };
      console.log(req.body, "req.bodyreq.bodyreq.bodyreq.body");
      Clinics.create(values)
        .then(async (resp) => {
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
        })
        .catch((err) => {
          console.log("ClinicBasic-err", err);
        });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  bookAppointment: async function (req, res) {
    try {
      const {
        doctor_id,
        clinic_id,
        date,
        time,
        user_type,
        status,
        booked_by,
        modify_by,
        user_id,
      } = req.body;

      let data = {
        doctor_id,
        clinic_id,
        date,
        date2: moment(date + time, "D-MMM-YYYYh:m A").format(),
        time,
        patient_id: user_id,
        codeused_id: 0,
        status,
        user_type,
        modify_by,
        booked_by,
        booked_category: "General",
        read_status: 0,
        doctor_confirmation: 0,
      };
      // PatientDoctorBookings.create(data)
      // 	.then((result) => {
      // 		console.log('bookAppointment-api-result', result);
      // 		return res.status(200).json({
      // 			data: result,
      // 			message: 'Appointment Booked Successfully.',
      // 		});
      // 	})
      // 	.catch((err) => {
      // 		console.log('bookAppointment-api-err', err);
      // 		return res.status(500).json({
      // 			message: 'Something Went Wrong',
      // 		});
      // 	});
    } catch (err) {
      console.log("bookAppointment-err", err);
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
