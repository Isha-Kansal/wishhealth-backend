"use strict";
const express = require("express");
const controller = require("./doctor.controller");
const router = express.Router();
router.get("/getDoctorDetails/:id", controller.getDoctorDetails);
router.post("/updateDoctorDetails/:id", controller.updateDoctorDetails);
router.post(
  "/updateDoctorEducationDetails/:id/:index",
  controller.updateDoctorEducationDetails
);

router.post(
  "/updateDoctorRegistrationDetails/:id",
  controller.updateDoctorRegistrationDetails
);

router.post("/updatePassword/:id", controller.updatePassword);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/resendOtp", controller.resendOtp);
router.get(
  "/getDoctorEducationDetails/:id",
  controller.getDoctorEducationDetails
);
router.get(
  "/getDoctorRegistrationDetails/:id",
  controller.getDoctorRegistrationDetails
);

module.exports = router;
