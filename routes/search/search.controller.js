const Sequelize = require("sequelize");
const PatientDetails = require("../../models/wh_patient_details");
const Users = require("../../models/wh_users");
const Doctordetails = require("../../models/wh_doctor_details");
const Doctorlanguages = require("../../models/wh_doctor_languages");
const Languages = require("../../models/wh_languages");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const Specialities = require("../../models/wh_specialities");
const Doctorqualifications = require("../../models/wh_doctor_qualifications");
const DoctorServices = require("../../models/wh_doctor_services");
const Colleges = require("../../models/wh_colleges");
const Qualifications = require("../../models/wh_qualifications");
const DoctorClinics = require("../../models/wh_doctor_clinics");
const Services = require("../../models/wh_services");
const Clinics = require("../../models/wh_clinic");
const DoctorClinicTimings = require("../../models/wh_doctor_clinic_timings");
const ClinicImages = require("../../models/wh_clinic_images");
const { Op } = Sequelize;
const getDoctorData = async function (req) {
  try {
    let clinicModel = {
      model: Clinics,
      include: [{ model: ClinicImages }],
    };
    if (req.body.location && req.body.location !== "") {
      clinicModel.required = true;
      clinicModel.where = {
        address: {
          [Op.like]: `%${req.body.location}%`,
        },
      };
    }
    const doctors = await Users.findAll({
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${req.body.doctorParams}%`,
            },
          },
          { role: "doctor" },
        ],
      },
      include: [
        {
          model: Doctordetails,
          where: {
            video_consultation: {
              [Op.in]:
                req.body.type === "video"
                  ? [1]
                  : req.body.type === "clinic"
                  ? [0]
                  : [0, 1],
            },
          },
        },
        {
          model: Doctorlanguages,
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
          model: Doctorqualifications,
          include: [
            {
              model: Colleges,
              attributes: ["college"],
              where: {
                college: {
                  [Op.ne]: null,
                },
              },
            },
            {
              model: Qualifications,
              attributes: ["degree"],
              where: {
                degree: {
                  [Op.ne]: null,
                },
              },
            },
          ],
        },
        {
          model: Doctorspecialities,
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
        {
          model: DoctorServices,
          include: [
            {
              model: Services,
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
          model: DoctorClinics,
          required: req.body.location && req.body.location !== "",
          include: [clinicModel],
        },
      ],
      // limit: req.body.limit,
      // offset: req.body.offset,
    });
    return doctors;
  } catch (err) {
    console.log(err, "err");
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};
const getDoctorClinicData = async function (req) {
  try {
    const clinicDetails = await DoctorClinicTimings.findAll({
      clinic_id: req.body.clinic_id,
      doctor_id: req.body.doctor_id,
    });
    return clinicDetails;
  } catch (err) {
    console.log(err, "err");
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};
const getSpecialityData = async function (req) {
  try {
    let clinicModel = {
      model: Clinics,
      include: [{ model: ClinicImages }],
    };
    if (req.body.location && req.body.location !== "") {
      clinicModel.required = true;
      clinicModel.where = {
        address: {
          [Op.like]: `%${req.body.location}%`,
        },
      };
    }
    const doctors = await Users.findAll({
      where: {
        role: "doctor",
      },
      include: [
        {
          model: Doctordetails,
          where: {
            video_consultation: {
              [Op.in]:
                req.body.type === "video"
                  ? [1]
                  : req.body.type === "clinic"
                  ? [0]
                  : [0, 1],
            },
          },
        },
        {
          model: Doctorlanguages,
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
          model: Doctorqualifications,
          include: [
            {
              model: Colleges,
              attributes: ["college"],
              where: {
                college: {
                  [Op.ne]: null,
                },
              },
            },
            {
              model: Qualifications,
              attributes: ["degree"],
              where: {
                degree: {
                  [Op.ne]: null,
                },
              },
            },
          ],
        },
        {
          model: Doctorspecialities,
          required: true,
          include: [
            {
              model: Specialities,
              required: true,
              attributes: ["title"],
              where: {
                title: {
                  [Op.like]: `%${req.body.doctorParams}%`,
                },
              },
            },
          ],
        },
        {
          model: DoctorServices,
          include: [
            {
              model: Services,
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
          model: DoctorClinics,
          required: req.body.location && req.body.location !== "",
          include: [clinicModel],
        },
      ],
      // limit: req.body.limit,
      // offset: req.body.offset,
    });
    return doctors;
  } catch (err) {
    console.log(err, "err");
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};
module.exports = {
  searchDoctors: async function (req, res) {
    try {
      let arr = [];
      const doctorData = await getDoctorData(req);
      const specialityData = await getSpecialityData(req);
      arr = [...doctorData, ...specialityData];
      return res.status(200).json({
        data: arr,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  getClinicDetails: async function (req, res) {
    try {
      let arr = [];
      const doctorClinicData = await getDoctorClinicData(req);
      const specialityData = await getSpecialityData(req);
      // arr = [...doctorData, ...specialityData];
      return res.status(200).json({
        data: doctorClinicData,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
