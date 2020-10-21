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
const ClinicTimings = require("../../models/wh_clinic_timings");
const Feedback = require("../../models/wh_feedback");
const VideoConsultation = require("../../models/wh_video_consultation_times");
const Cities = require("../../models/wh_cities");
const { Op } = Sequelize;
const recommendationsData = async function (req, arr) {
  try {
    console.log(arr, "recommendationsDatarecommendationsData");
    let city;

    if (req.body.location !== "") {
      city = await Cities.findOne({
        where: {
          name: {
            [Op.ne]: `%${req.body.location.trim()}%`,
          },
        },
      });
      // doctorDetailwhere.push({
      //   city_id: {
      //     [Op.ne]: city.id,
      //   },
      // });
    }
    const specialityObj =
      arr && arr.length > 0
        ? {
            speciality_id: {
              [Op.in]: arr,
            },
          }
        : {
            speciality_id: {
              [Op.notIn]: arr,
            },
          };
    const doctors = await Users.findAndCountAll({
      where: {
        role: "doctor",
        status: "1",
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,
          required:
            req.body.type !== "" || req.body.location !== "" ? true : false,
          where: {
            video_consultation: {
              [Op.in]: [1],
            },
          },
        },
        {
          model: Feedback,
          as: "feedback",
          required: false,
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
          where: specialityObj,
          include: [
            {
              model: Specialities,
              required: true,
              attributes: ["title"],
              where: {
                title: {
                  [Op.like]: `%${req.body.doctorParams.trim()}%`,
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
    return doctors.rows;
  } catch (err) {
    console.log(err, "err");
    return [];
  }
};
const getDoctorData = async function (req) {
  try {
    let featured = req.body.featured
      ? {
          [Op.gte]: 1,
        }
      : {
          [Op.ne]: null,
        };

    let city;
    let users = [];
    if (req.body.location !== "") {
      city = await Cities.findOne({
        where: {
          name: {
            [Op.like]: `%${req.body.location.trim()}%`,
          },
        },
      });
      ownClinics = await Clinics.findAll({
        where: {
          city_id: city && city.id,
        },
      });
      let clinic_ids = [];
      ownClinics &&
        ownClinics.length > 0 &&
        ownClinics.map((own) => {
          if (!users.includes(own.admin_id)) {
            users.push(own.admin_id);
          }
          if (!clinic_ids.includes(own.clinic_id)) {
            clinic_ids.push(own.clinic_id);
          }
        });
      joinedClinics = await DoctorClinics.findAll({
        where: {
          clinic_id: {
            [Op.in]: clinic_ids,
          },
        },
      });
      joinedClinics &&
        joinedClinics.length > 0 &&
        joinedClinics.map((joined) => {
          if (!users.includes(joined.user_id)) {
            users.push(joined.user_id);
          }
        });
    }
    let userArr = [
      {
        name: {
          [Op.like]: `%${req.body.doctorParams.trim()}%`,
        },
      },
      { role: "doctor" },
      { status: "1" },
      {
        rankings: featured,
      },
    ];
    if (users.length > 0) {
      userArr.push({
        user_id: {
          [Op.in]: users,
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
          },
        },
        {
          model: Feedback,
          as: "feedback",
          required: false,
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
              required: false,
              attributes: ["title"],
              where: {
                title: {
                  [Op.like]: `%${req.body.doctorParams.trim()}%`,
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
const getSpecialityData = async function (req, arr) {
  try {
    let city;
    let users = [];
    if (req.body.location !== "") {
      city = await Cities.findOne({
        where: {
          name: {
            [Op.like]: `%${req.body.location.trim()}%`,
          },
        },
      });
      ownClinics = await Clinics.findAll({
        where: {
          city_id: city && city.id,
        },
      });
      let clinic_ids = [];
      ownClinics &&
        ownClinics.length > 0 &&
        ownClinics.map((own) => {
          if (!users.includes(own.admin_id)) {
            users.push(own.admin_id);
          }
          if (!clinic_ids.includes(own.clinic_id)) {
            clinic_ids.push(own.clinic_id);
          }
        });
      joinedClinics = await DoctorClinics.findAll({
        where: {
          clinic_id: {
            [Op.in]: clinic_ids,
          },
        },
      });
      joinedClinics &&
        joinedClinics.length > 0 &&
        joinedClinics.map((joined) => {
          if (!users.includes(joined.user_id)) {
            users.push(joined.user_id);
          }
        });
    }
    let userArr = [{ role: "doctor" }, { status: "1" }];
    if (users.length > 0) {
      userArr.push({
        user_id: {
          [Op.in]: users,
        },
      });
    }
    const doc_speciality = await Doctorspecialities.findAndCountAll({
      where: {
        speciality_id: {
          [Op.in]: arr,
        },
      },
      distinct: true,
      include: [
        {
          model: Users,
          where: {
            [Op.and]: userArr,
          },
          required: true,
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
              },
            },
          ],
        },
      ],
    });
    const doctors = await Users.findAndCountAll({
      where: {
        role: "doctor",
        status: "1",
        user_id: {
          [Op.in]: users,
        },
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
          },
        },
        {
          model: Feedback,
          as: "feedback",
          required: false,
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
          where: {
            speciality_id: {
              [Op.in]: arr,
            },
          },
          include: [
            {
              model: Specialities,
              required: true,
              attributes: ["title"],
              where: {
                title: {
                  [Op.like]: `%${req.body.doctorParams.trim()}%`,
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
    console.log(doctors.rows, "doctors.rowsdoctors.rowsdoctors.rows");
    return { data: doctors.rows, count: doc_speciality.count };
  } catch (err) {
    console.log(err, "err");
    return [];
  }
};
module.exports = {
  searchDoctors: async function (req, res) {
    try {
      let arr = [];
      let recommendations = [];
      let count = 0;
      console.log(req.body, "dgsyhgfshgdh");
      let specialityExist = [];
      let array = [];
      if (req.body.doctorParams !== "") {
        specialityExist = await Specialities.findAll({
          where: {
            title: {
              [Op.like]: `%${req.body.doctorParams.trim()}%`,
            },
          },
          attributes: ["speciality_id"],
        });

        const speciality = JSON.parse(JSON.stringify(specialityExist));
        speciality &&
          speciality.length > 0 &&
          speciality.map((item) => {
            array.push(item.speciality_id);
          });
        console.log(array, "arrarrarr", speciality);
      }

      if (specialityExist.length === 0) {
        const doctorData = await getDoctorData(req);
        arr = [...doctorData.data];
        count = doctorData.count;
      } else {
        const specialityData = await getSpecialityData(req, array);
        arr = [...specialityData.data];

        count = specialityData.count;
      }
      console.log(arr, "arrarrarrarrarrarr", arr.length);
      if (arr.length === 0) {
        recommendations = await recommendationsData(req, array);
      }
      return res.status(200).json({
        data: { arr, recommendations },
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
            [Op.like]: `%${req.body.search.trim()}%`,
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
            [Op.like]: `%${req.body.search.trim()}%`,
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
            required: true,

            include: [
              { model: ClinicImages, required: false },
              {
                model: Bookings,
                required: false,
                where: {
                  doctor_id: req.params.user_id,
                  date2: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0)),
                  },
                },
              },
              { model: ClinicTimings, required: false },
            ],
          },
        ],
        order: [["clinic_id", "ASC"]],
      });
      const ownClinicData = await Clinics.findAll({
        where: {
          admin_id: req.params.user_id,
        },
        include: [
          { model: ClinicImages, required: false },
          {
            model: Bookings,
            required: false,
            where: {
              doctor_id: req.params.user_id,
              date2: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0)),
              },
            },
          },
          { model: ClinicTimings, required: false },
        ],
        order: [["clinic_id", "ASC"]],
      });

      let clinics = JSON.parse(JSON.stringify(doctorClinicData));
      let own = JSON.parse(JSON.stringify(ownClinicData));
      let data = [];
      let obj = {};
      const videobookings = await Bookings.findAll({
        where: {
          doctor_id: req.params.user_id,
          clinic_id: 1,
        },
      });
      const video_timings = await VideoConsultation.findOne({
        where: {
          doctor_id: req.params.user_id,
        },
      });
      // let ownData = [];
      // own &&
      //   own.length > 0 &&
      //   own.map((data) => {
      //     let object = {
      //       ...data,
      //       videobookings,
      //     };
      //     ownData.push(object);
      //   });
      for (let i = 0; i < clinics.length; i++) {
        const clinicData = clinics[i];

        let clinicJson = JSON.parse(JSON.stringify(clinicData));
        let found =
          data &&
          data.length > 0 &&
          data.findIndex((item) => {
            console.log(item, "dhjhsjhas", clinicJson);
            return item.wh_clinic.clinic_id === clinicJson.clinic_id;
          });
        console.log(found, "foundfoundfoundfound");
        let available_timings = [];
        let object = { day: clinicJson.day };
        let time = [];

        if ((found === -1 || found === false) && clinics[i].clinic_id) {
          if (doctorDetails && doctorDetails.video_consultation === 1) {
            obj.videobookings = videobookings;
            obj.video_timings = video_timings;
          }
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
        if (found === -1 || found === false) {
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
