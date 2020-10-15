const md5 = require("md5");
const Sequelize = require("sequelize");
const Doctordetails = require("../../models/wh_doctor_details");

module.exports = {
  Login: async function (req, res) {
    try {
      const user = await Doctordetails.findOne({
        where: {
          username: req.body.username,
          password: md5(req.body.password),
        },
      });
      return res.status(200).json({
        data: user,
        message: user ? "login successfully" : "not registered",
      });
    } catch (err) {
      console.log(err, "err");
      return res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  },
};
