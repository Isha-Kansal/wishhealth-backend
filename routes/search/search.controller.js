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
const Bookings = require("../../models/wh_patient_doctor_bookings");
const moment = require("moment");
const { Op } = Sequelize;
const getDoctorData = async function (req) {
  try {
    let featured = req.body.featured
      ? {
          [Op.gte]: 1,
        }
      : {
          [Op.ne]: null,
        };
    let specialityExist = [];
    if (req.body.doctorParams !== "") {
      specialityExist = await Specialities.findAll({
        where: {
          title: {
            [Op.like]: `%${req.body.doctorParams}%`,
          },
        },
      });
    }

    console.log(
      specialityExist,
      "specialityExistspecialityExistspecialityExist"
    );
    let userArr = [
      { role: "doctor" },
      { status: "1" },
      {
        rankings: featured,
      },
    ];
    console.log(userArr, "userArruserArruserArr");
    if (specialityExist.length === 0) {
      userArr.push({
        name: {
          [Op.like]: `%${req.body.doctorParams}%`,
        },
      });
    }
    const doctors = await Users.findAndCountAll({
      where: {
        [Op.and]: userArr,
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,
          required:
            req.body.type !== "" || req.body.location !== "" ? true : false,
          where: {
            video_consultation: {
              [Op.in]:
                req.body.type === "video"
                  ? [1]
                  : req.body.type === "clinic"
                  ? [0]
                  : [0, 1],
            },
            city: {
              [Op.like]: `%${req.body.location}%`,
            },
          },
        },
        {
          model: Doctorlanguages,
          required: false,
          include: [
            {
              model: Languages,
              required: false,
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
          required: false,
          include: [
            {
              model: Qualifications,
              required: false,
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
          required: false,
          include: [
            {
              model: Specialities,
              required: specialityExist.length > 0 ? true : false,
              attributes: ["title"],
              where: {
                title: {
                  [Op.like]: `%${req.body.doctorParams}%`,
                },
              },
            },
          ],
        },
      ],
      limit: req.body.limit,
      offset: req.body.offset,
      order: [["rankings", "DESC"]],
    });
    return { data: doctors.rows, count: doctors.count };
  } catch (err) {
    console.log(err, "err");
    return [];
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
    let featured = req.body.featured
      ? {
          [Op.gte]: 1,
        }
      : {
          [Op.ne]: null,
        };
    const doctors = await Users.findAndCountAll({
      where: {
        role: "doctor",
        rankings: featured,
      },
      include: [
        {
          model: Doctordetails,
          required: true,
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
          duplicating: false,
          include: [
            {
              model: Languages,
              duplicating: false,
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
          duplicating: false,
          include: [
            {
              model: Qualifications,
              duplicating: false,
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
      ],
      limit: req.body.limit,
      offset: req.body.offset,
    });
    return { data: doctors.rows, count: doctors.count };
  } catch (err) {
    console.log(err, "err");
    return [];
  }
};
module.exports = {
  searchDoctors: async function (req, res) {
    try {
      let arr = [];
      let count = 0;
      console.log(req.body, "dgsyhgfshgdh");
      const doctorData = await getDoctorData(req);
      arr = [...doctorData.data];
      count = doctorData.count;
      // if (req.body.doctorParams !== "") {
      //   const specialityData = await getSpecialityData(req);
      //   arr = [...arr, ...specialityData.data];
      //   count += specialityData.count;
      // }
      console.log(arr, "arrarrarrarrarrarr", arr.length);
      return res.status(200).json({
        data: arr,
        count,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  suggestions: async function (req, res) {
    try {
      let arr = [];
      console.log(req.body, "dgsyhgfshgdh");
      let doctorData = await Users.findAll({
        where: {
          name: {
            [Op.like]: `%${req.body.search}%`,
          },
        },
        attributes: ["name"],
      });
      doctorData &&
        doctorData.length > 0 &&
        doctorData.map((data) => {
          arr.push(data.name);
        });
      let specialityData = await Specialities.findAll({
        where: {
          title: {
            [Op.like]: `%${req.body.search}%`,
          },
        },
        attributes: ["title"],
      });
      specialityData &&
        specialityData.length > 0 &&
        specialityData.map((data) => {
          arr.push(data.title);
        });

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

  getDoctorClinics: async function (req, res) {
    try {
      const doctorDetails = await Doctordetails.findOne({
        where: {
          user_id: req.params.user_id,
        },
        attributes: ["video_consultation"],
      });
      const doctorClinicData = await DoctorClinicTimings.findAll({
        where: {
          doctor_id: req.params.user_id,
        },
        include: [
          {
            model: Clinics,
            required: false,
            include: [{ model: ClinicImages, required: false }],
          },
        ],
      });
      const ownClinicData = await Clinics.findAll({
        where: {
          admin_id: req.params.user_id,
        },
        include: [{ model: ClinicImages, required: false }],
      });

      let clinics = JSON.parse(JSON.stringify(doctorClinicData));
      let own = JSON.parse(JSON.stringify(ownClinicData));
      let abc = [...clinics, ...own];
      let data = [];
      let obj = {};

      for (let i = 0; i < clinics.length; i++) {
        const clinicData = clinics[i];
        let clinicJson = JSON.parse(JSON.stringify(clinicData));
        let found =
          data &&
          data.length > 0 &&
          data.findIndex(
            (item) => item.wh_clinic.clinic_id === clinicJson.clinic_id
          );
        console.log(found, "foundfoundfoundfound");
        let available_timings = [];
        let object = { day: clinicJson.day };
        let time = [];

        if ((found === -1 || !found) && clinics[i].clinic_id) {
          const clinicbookings = await Bookings.findAll({
            where: {
              doctor_id: req.params.user_id,
              clinic_id: clinics[i].clinic_id,
              date2: {
                [Op.gte]: moment().startOf("day").toDate(),
              },
            },
          });
          if (doctorDetails && doctorDetails.video_consultation === 1) {
            const videobookings = await Bookings.findAll({
              where: {
                doctor_id: req.params.user_id,
                clinic_id: 0,
                date2: {
                  [Op.gte]: moment().startOf("day").toDate(),
                },
              },
            });
            obj.videobookings = videobookings;
          }
          obj.clinicbookings = clinicbookings;
        } else {
          available_timings = data[found].available_timings;
        }

        Object.keys(clinicJson).map((clinic) => {
          if (clinic.includes("AM") || clinic.includes("PM")) {
            if (clinicJson[`${clinic}`] === "1") {
              time.push(clinic);
              object.time = time;
            }
          }
        });
        available_timings.push(object);
        obj.available_timings = available_timings;
        obj = {
          ...obj,
          wh_clinic: clinicJson.wh_clinic,
        };
        if (found === -1 || !found) {
          data.push(obj);
        } else {
          data[found] = obj;
        }
      }

      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
