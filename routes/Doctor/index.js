"use strict";
const express = require("express");
const controller = require("./doctor.controller");
const router = express.Router();
router.get("/getDoctorDetails/:id", controller.getDoctorDetails);
router.get("/getDoctorClinicBasics/:id", controller.getDoctorClinicDetails);

router.post("/updateDoctorDetails/:id", controller.updateDoctorDetails);
router.post(
  "/updateDoctorEducationDetails/:id/:index",
  controller.updateDoctorEducationDetails
);
router.post(
  "/deleteDoctorEducationDetails/:id/:index",
  controller.deleteDoctorEducationDetails
);
router.post(
  "/updateDoctorRegistrationDetails/:id",
  controller.updateDoctorRegistrationDetails
);
router.post("/updateDoctorClinicBasic", controller.updateDoctorClinicBasic);
router.post("/updatePassword/:id", controller.updatePassword);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/resendOtp", controller.resendOtp);
router.get(
  "/getDoctorEducationDetails/:id",
  controller.getDoctorEducationDetails
);
router.post("/leaveClinic", controller.leaveClinic);
router.get(
  "/getDoctorRegistrationDetails/:id",
  controller.getDoctorRegistrationDetails
);

module.exports = router;
