"use strict";
const express = require("express");
const controller = require("./patient.controller");
const router = express.Router();
router.post("/getPatientExistence", controller.getPatientExistence);
router.post("/patientSave", controller.patientSave);
router.get("/getPatientBookings/:patient_id", controller.getPatientBookings);
module.exports = router;
