"use strict";
const express = require("express");
const controller = require("./search.controller");
const router = express.Router();
router.post("/searchDoctors", controller.searchDoctors);
router.get("/getDoctorDetails/:user_id", controller.getDoctorDetails);
router.get("/getDoctorClinics/:user_id", controller.getDoctorClinics);
router.post("/suggestions", controller.suggestions);
module.exports = router;
