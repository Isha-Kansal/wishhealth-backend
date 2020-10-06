const Sequelize = require("sequelize");
const Users = require("../../models/wh_users");
const Doctordetails = require("../../models/wh_doctor_details");
const Doctorlanguages = require("../../models/wh_doctor_languages");
const Languages = require("../../models/wh_languages");
const Specialities = require("../../models/wh_specialities");
const Doctorspecialities = require("../../models/wh_doctor_specialities");
const sequelize = require("../../config/mysql");
const { Op } = sequelize;
module.exports = {
  createDoctor: async function (req, res) {
    try {
      let obj = {
        name: req.body.name,
        role: "doctor",
        contact: req.body.phone,
      };
      Users.create(obj).then(async (res) => {
        const response = JSON.parse(JSON.stringify(res));
        console.log(response, "response");

        let details = {
          phone: req.body.phone,
          email: req.body.email,
          gender: req.body.gender,
          profile_pic: req.body.profile_pic,
          prefix: "Dr.",
          city_id: req.body.city,
          user_id: response.user_id,
        };
        Doctordetails.create(details);
        const languages = await Languages.findAll({
          where: {
            name: {
              [Op.in]: req.body.languages,
            },
          },
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
