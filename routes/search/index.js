"use strict";
const express = require("express");
const controller = require("./search.controller");
const router = express.Router();
router.post("/searchDoctors", controller.searchDoctors);
router.get("/getDoctorClinics/:user_id", controller.getDoctorClinics);

module.exports = router;
