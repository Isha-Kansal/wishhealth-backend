const Sequelize = require("sequelize");
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
const States = require("../../models/wh_states");
const { Op } = Sequelize;
const CouncilRegistration = require("../../models/wh_medical_council_registration");
const Council = require("../../models/wh_medical_council");
const ClinicServices = require("../../models/wh_clinic_services");
const PatientDoctorBookings = require("../../models/wh_patient_doctor_bookings");
const { SERVER_ENVIRONMENT } = process.env;

const getLiveDoctorData = async function (req) {
  try {
    const doctorsData = await getDoctorData(req);
    const doctors = doctorsData.data;

    const finalArr = [];
    if (doctors.length > 0) {
      for (let i = 0; i < doctors.length; i++) {
        let doctor = doctors[i];
        console.log("doctor: ", doctor);
        const doctorTimings = await DoctorClinicTimings.findAll({
          where: {
            doctor_id: doctor.user_id,
          },
        });
        console.log("getLiveDoctorData-doctorTimings", doctorTimings);
        const doctorTime = JSON.parse(JSON.stringify(doctorTimings));

        let currentday = moment().day();
        console.log("getLiveDoctorData-currentday", currentday);
        let doctorTodayTimings = doctorTime.find((item) => {
          if (parseInt(item.day) === currentday) {
            return true;
          }
        });
        console.log("getLiveDoctorData-doctorTodayTimings", doctorTodayTimings);
        const doctorAvailabilityTiming = [];
        if (doctorTodayTimings) {
          Object.keys(doctorTodayTimings).filter((ele) => {
            if (
              (ele.includes("AM") || ele.includes("PM")) &&
              doctorTodayTimings[ele] === "1"
            ) {
              doctorAvailabilityTiming.push(ele);
            }
          });

          const currenttime = moment().add(5, "hours").add(30, "minutes");
          // const startTime = moment(doctorAvailabilityTiming[0], 'HH:mm A');
          const startTime = moment(doctorAvailabilityTiming[0], "h:mm a");
          const endTime = moment(
            doctorAvailabilityTiming[doctorAvailabilityTiming.length - 1],
            "h:mm a"
          );

          console.log("getLiveDoctorData-currenttime", currenttime);
          console.log("getLiveDoctorData-startTime", startTime);
          console.log("getLiveDoctorData-endTime", endTime);
          if (
            doctorAvailabilityTiming.length > 0 &&
            startTime.isBefore(currenttime) &&
            currenttime.isBefore(endTime)
          ) {
            finalArr.push(doctor);
          }
        }
      }
    }

    return { data: finalArr, count: doctorsData.count };
  } catch (err) {
    console.log(err, "err1111");
    return [];
  }
};
const recommendationsData = async function (req, arr) {
  try {
    console.log(arr, "recommendationsDatarecommendationsData");
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
    let userArr = [{ role: "doctor" }, { status: "1" }];
    if (users.length > 0) {
      userArr.push({
        user_id: {
          [Op.notIn]: users,
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

          where: {
            video_consultation: {
              [Op.in]: [1],
            },
            is_verified: {
              [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
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
                  [Op.like]: `%${req.searchString}%`,
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
const getLocationData = async function (req) {
  try {
    let featured = req.body.featured
      ? {
          [Op.gte]: 1,
        }
      : {
          [Op.ne]: null,
        };

    let userArr = [
      {
        name: {
          [Op.like]: `%${req.searchString}%`,
        },
      },
      { role: "doctor" },
      { status: "1" },
      {
        rankings: featured,
      },
    ];

    const doctors = await Users.findAll({
      where: {
        [Op.and]: userArr,
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,

          where: {
            video_consultation: {
              [Op.in]: req.body.type === "video" ? [1] : [0, 1],
            },
            // is_verified: {
            //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
            // },
          },
          include: [
            {
              model: Cities,
            },
            {
              model: States,
            },
          ],
        },
        {
          model: DoctorClinicTimings,
          required: true,
          as: "clinic_timings",
          include: [
            {
              model: Clinics,
              required: true,
              attributes: [
                [
                  Sequelize.literal(
                    `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(latitude)) * cos(radians(${req.body.longitude}) - radians(longitude)) + sin(radians(${req.body.latitude})) * sin(radians(latitude)))`
                  ),
                  "distance",
                ],
              ],
            },
          ],
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
                  [Op.like]: `%${req.searchString}%`,
                },
              },
            },
          ],
        },
      ],
      order: [["rankings", "DESC"]],
    });
    const doctorData = JSON.parse(JSON.stringify(doctors));

    let result = [];
    let final = doctorData[0];
    for (let a = 0; a < doctorData.length; a++) {
      let docA = doctorData[a];
      for (b = a + 1; b < doctorData.length; b++) {
        let docB = doctorData[b];
        let aSum =
          typeof docA.clinic_timings.wh_clinic === "object"
            ? docA.clinic_timings.wh_clinic.distance
            : null;
        let bSum =
          typeof docB.clinic_timings.wh_clinic === "object"
            ? docB.clinic_timings.wh_clinic.distance
            : null;
        if (!aSum || !bSum) {
          if (!aSum) {
            let aResult = docA.clinic_timings.sort(function (c, d) {
              return c.wh_clinic.distance > d.wh_clinic.distance;
            });

            aSum = aResult.length > 0 ? aResult[0].wh_clinic.distance : 0;
          }
          if (!bSum) {
            let bResult = docB.clinic_timings.sort(function (c, d) {
              return c.wh_clinic.distance > d.wh_clinic.distance;
            });
            bSum = bResult.length > 0 ? bResult[0].wh_clinic.distance : 0;
          }
        }

        if (aSum > bSum) {
          if (result.includes(docB)) {
            break;
          }
          final = docB;
          docA = docB;
        } else {
          final = docA;
        }
      }
      console.log(final, "finalfinalfinalfinal");
      if (!result.includes(final)) {
        result.push(final);
      }
    }

    let finalResult = [];
    for (let i = req.body.offset; i < req.body.offset + req.body.limit; i++) {
      if (result[i]) {
        finalResult.push(result[i]);
      }
    }
    return { data: finalResult, count: result.length };
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
          [Op.like]: `%${req.searchString}%`,
        },
      },
      { role: "doctor" },
      { status: "1" },
      {
        rankings: featured,
      },
    ];
    console.log(users, "usersusersusers");
    if (req.body.location !== "") {
      userArr.push({
        user_id: {
          [Op.in]: users,
        },
      });
    }
    console.log(userArr, "userArruserArr");
    let days = ["1", "2", "3", "4", "5", "6", "7"];
    if (req.body.consult) {
      days = [];
      let day = moment().day();
      days.push(day.toString());
    }

    const doctors = await Users.findAndCountAll({
      where: {
        [Op.and]: userArr,
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,

          where: {
            video_consultation: {
              [Op.in]: req.body.type === "video" ? [1] : [0, 1],
            },
            // is_verified: {
            //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
            // },
          },
          include: [
            {
              model: Cities,
            },
            {
              model: States,
            },
          ],
        },
        {
          model: DoctorClinicTimings,
          required: req.body.consult ? true : false,
          as: "clinic_timings",
          where: {
            day: {
              [Op.in]: days,
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
const getLocationSpecialityData = async function (req, arr) {
  try {
    let userArr = [{ role: "doctor" }, { status: "1" }];

    const doc_speciality = await Doctorspecialities.findAll({
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

              where: {
                video_consultation: {
                  [Op.in]: req.body.type === "video" ? [1] : [0, 1],
                },
                // is_verified: {
                //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
                // },
              },
            },
          ],
        },
      ],
    });
    const doctors = await Users.findAll({
      where: {
        [Op.and]: userArr,
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,

          where: {
            video_consultation: {
              [Op.in]: req.body.type === "video" ? [1] : [0, 1],
            },
            // is_verified: {
            //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
            // },
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
          model: DoctorClinicTimings,
          required: true,
          as: "clinic_timings",
          include: [
            {
              model: Clinics,
              required: true,
              attributes: [
                [
                  Sequelize.literal(
                    `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(latitude)) * cos(radians(${req.body.longitude}) - radians(longitude)) + sin(radians(${req.body.latitude})) * sin(radians(latitude)))`
                  ),
                  "distance",
                ],
              ],
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
                  [Op.like]: `%${req.searchString}%`,
                },
              },
            },
          ],
        },
      ],
      order: [["rankings", "DESC"]],
    });

    const doctorsData = JSON.parse(JSON.stringify(doctors));

    let result = [];
    let final = doctorsData[0];
    for (let a = 0; a < doctorsData.length; a++) {
      let docA = doctorsData[a];
      for (b = a + 1; b < doctorsData.length; b++) {
        let docB = doctorsData[b];
        let aSum =
          typeof docA.clinic_timings.wh_clinic === "object"
            ? docA.clinic_timings.wh_clinic.distance
            : null;
        let bSum =
          typeof docB.clinic_timings.wh_clinic === "object"
            ? docB.clinic_timings.wh_clinic.distance
            : null;
        if (!aSum || !bSum) {
          if (!aSum) {
            let aResult = docA.clinic_timings.sort(function (c, d) {
              return c.wh_clinic.distance > d.wh_clinic.distance;
            });

            aSum = aResult.length > 0 ? aResult[0].wh_clinic.distance : 0;
          }
          if (!bSum) {
            let bResult = docB.clinic_timings.sort(function (c, d) {
              return c.wh_clinic.distance > d.wh_clinic.distance;
            });
            bSum = bResult.length > 0 ? bResult[0].wh_clinic.distance : 0;
          }
        }

        if (aSum > bSum) {
          if (result.includes(docB)) {
            break;
          }
          final = docB;
          docA = docB;
        } else {
          final = docA;
        }
      }
      console.log(final, "finalfinalfinalfinal");
      if (!result.includes(final)) {
        result.push(final);
      }
    }

    let finalResult = [];
    for (let i = req.body.offset; i < req.body.offset + req.body.limit; i++) {
      if (result[i]) {
        finalResult.push(result[i]);
      }
    }
    return { data: finalResult, count: doc_speciality.length };
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
    let days = ["1", "2", "3", "4", "5", "6", "7"];
    if (req.body.consult) {
      days = [];
      let day = moment().day();
      days.push(day.toString());
    }
    if (req.body.location !== "") {
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

              where: {
                video_consultation: {
                  [Op.in]: req.body.type === "video" ? [1] : [0, 1],
                },
                // is_verified: {
                //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
                // },
              },
            },
          ],
        },
      ],
    });
    const doctors = await Users.findAndCountAll({
      where: {
        [Op.and]: userArr,
      },
      distinct: true,
      include: [
        {
          model: Doctordetails,
          where: {
            video_consultation: {
              [Op.in]: req.body.type === "video" ? [1] : [0, 1],
            },
            // is_verified: {
            //   [Op.in]: SERVER_ENVIRONMENT === "local" ? [0, 1] : [1],
            // },
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
          model: DoctorClinicTimings,
          required: req.body.consult ? true : false,
          as: "clinic_timings",
          where: {
            day: {
              [Op.in]: days,
            },
          },
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
                  [Op.like]: `%${req.searchString}%`,
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
      let search = req.body.doctorParams.toLowerCase().trim();
      let search1 = search.replace(/[^a-zA-Z ]/g, "");
      let searchString = search1.replace("dr", "");
      console.log(searchString, "searchStringsearchString");
      let searchObj = {
        body: req.body,
        searchString: searchString.trim(),
      };
      if (!req.body.consult) {
        if (req.body.doctorParams !== "") {
          specialityExist = await Specialities.findAll({
            where: {
              title: {
                [Op.like]: `%${searchString}%`,
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
        if (specialityExist.length > 0) {
          if (req.body.latitude && req.body.longitude) {
            const locationData = await getLocationSpecialityData(
              searchObj,
              array
            );
            arr = [...locationData.data];

            count = locationData.count;
          } else {
            const specialityData = await getSpecialityData(searchObj, array);
            arr = [...specialityData.data];

            count = specialityData.count;
          }
        }
        if (specialityExist.length === 0 || arr.length === 0) {
          if (req.body.latitude && req.body.longitude) {
            const locationData = await getLocationData(searchObj, array);
            arr = [...locationData.data];

            count = locationData.count;
          } else {
            const doctorData = await getDoctorData(searchObj);
            arr = [...doctorData.data];
            count = doctorData.count;
          }
        }
        console.log(arr, "arrarrarrarrarrarr", arr.length);
        if (arr.length === 0) {
          recommendations = await recommendationsData(searchObj, array);
        }
      } else {
        const livedoctorData = await getLiveDoctorData(searchObj);
        arr = [...livedoctorData.data];
        count = livedoctorData.count;
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
  getDoctorDetails: async function (req, res) {
    try {
      const data = await Users.findOne({
        where: {
          user_id: req.params.user_id,
        },
        distinct: true,
        include: [
          {
            model: Doctordetails,
            required: true,
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
              {
                model: Colleges,
              },
            ],
          },
          {
            model: Doctorspecialities,
            required: false,
            include: [
              {
                model: Specialities,
                required: true,
                attributes: ["title"],
              },
            ],
          },
          {
            model: DoctorServices,
            attributes: ["id", "service_id"],
            include: [
              {
                model: Services,
                attributes: ["name", "image", "priority"],
              },
            ],
          },
          {
            model: CouncilRegistration,
            include: [
              {
                model: Council,
              },
            ],
          },
        ],
      });
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
  suggestions: async function (req, res) {
    try {
      let arr = [];
      console.log(req.body, "dgsyhgfshgdh");
      let search = req.body.search.toLowerCase().trim();
      let search1 = search.replace(/[^a-zA-Z ]/g, "");
      let searchString = search1.replace("dr", "");
      let doctorData = await Users.findAll({
        where: {
          name: {
            [Op.like]: `%${searchString.trim()}%`,
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
            [Op.like]: `%${searchString.trim()}%`,
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
              {
                model: Cities,
                required: false,
                where: {
                  state_id: {
                    [Op.col]: "wh_clinic.state_id",
                  },
                },
              },
              { model: ClinicImages, required: false },
              {
                model: ClinicServices,
                required: false,
                include: [{ model: Services, required: true }],
              },
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
      const joinClinicData = await DoctorClinics.findAll({
        where: {
          user_id: req.params.user_id,
        },
        include: [
          {
            model: Clinics,
            required: true,

            include: [
              {
                model: Cities,
                required: false,
                where: {
                  state_id: {
                    [Op.col]: "wh_clinic.state_id",
                  },
                },
              },
              { model: ClinicImages, required: false },
              {
                model: ClinicServices,
                required: false,
                include: [{ model: Services, required: true }],
              },
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
          {
            model: Cities,
            required: false,
            where: {
              state_id: {
                [Op.col]: "wh_clinic.state_id",
              },
            },
          },
          { model: ClinicImages, required: false },
          {
            model: ClinicServices,
            required: false,
            include: [{ model: Services, required: true }],
          },
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
      let join = JSON.parse(JSON.stringify(joinClinicData));
      let data = [];
      let obj = {};
      const videobookings = await Bookings.findAll({
        where: {
          doctor_id: req.params.user_id,
          clinic_id: 1,
        },
      });
      const video_timings = await VideoConsultation.findAll({
        where: {
          doctor_id: req.params.user_id,
        },
      });
      let ownData = [];
      // own &&
      //   own.length > 0 &&
      //   own.map((data) => {
      //     let object = {
      //       ...data,
      //       videobookings,
      //       video_timings,
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
      // if (
      //   data.length === 0 &&
      //   doctorDetails &&
      //   doctorDetails.video_consultation === 1
      // ) {
      //   let obj = doctorDetails;
      //   obj.videobookings = videobookings;
      //   obj.video_timings = video_timings;
      //   data.push(obj);
      // }

      return res.status(200).json({
        data:
          data && data.length > 0
            ? data
            : doctorDetails && doctorDetails.video_consultation === 1
            ? {
                clinics: {
                  own,
                  join,
                },
                videobookings,
                video_timings,
              }
            : own.length > 0 || join.length > 0
            ? {
                clinics: {
                  own,
                  join,
                },
              }
            : [],
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  searchClinics: async function (req, res) {
    try {
      console.log("searchClinics-req.body", req.body);
      console.log("searchClinics-req.params", req.params);
      const { clinicName, location, user_id, latitude, longitude } = req.body;
      const cond = {};
      let orderby = "";
      if (clinicName) {
        cond.name = {
          [Op.like]: "%" + clinicName + "%",
        };
      }
      if (location) {
        cond.address = {
          [Op.like]: "%" + location + "%",
        };
      }
      if (user_id) {
        cond.admin_id = user_id;
      }
      if (latitude && longitude) {
        orderby = Sequelize.literal(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(${longitude}) - radians(longitude)) + sin(radians(${latitude})) * sin(radians(latitude))) ASC`
        );
      }
      console.log("searchClinics-cond", cond);
      console.log("searchClinics-orderby", orderby);
      const clinics = await Clinics.findAndCountAll({
        where: cond,
        order: orderby,
        attributes: ["clinic_id", "name", "address"],
      });
      return res.status(200).json({
        data: { count: clinics.count, listing: clinics.rows || [] },
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
  searchPatients: async (req, res) => {
    try {
      const { clinic_id, type } = req.body;
      console.log("searchClinics-req.body", req.body);
      let cond = {};
      const date = moment();
      let bookings = [];
      if (type) {
        switch (type) {
          case "past":
            cond.created_at = {
              [Op.lte]: date.toDate(),
            };
            break;
          case "today":
            cond.created_at = {
              [Op.gte]: date.startOf("day").toDate(),
              [Op.lte]: date.endOf("day").toDate(),
            };
            break;
          case "future":
            cond.created_at = {
              [Op.gte]: date.toDate(),
            };
        }
      }
      if (clinic_id) cond.clinic_id = clinic_id;
      console.log("searchClinics-cond", cond);
      if (cond) {
        bookings = await PatientDoctorBookings.findAll({
          where: cond,
        });
      }
      return res.status(200).json({
        data: bookings,
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
