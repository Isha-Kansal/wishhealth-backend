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
router.post("/searchDoctors", controller.searchDoctors);

router.post("/updatePassword/:id", controller.updatePassword);
router.get(
  "/getDoctorEducationDetails/:id",
  controller.getDoctorEducationDetails
);
router.get(
  "/getDoctorRegistrationDetails/:id",
  controller.getDoctorRegistrationDetails
);

module.exports = router;
