"use strict";
const express = require("express");
const controller = require("./create.controller");
const router = express.Router();
router.post("/createDoctor", controller.createDoctor);
router.post("/createDoctorDetails", controller.createDoctorDetails);
router.post("/RegistrationDetails", controller.RegistrationDetails);
router.post("/EducationDetails", controller.EducationDetails);

module.exports = router;
