"use strict";
const express = require("express");
const controller = require("./patient.controller");
const router = express.Router();
router.post("/getPatientExistence", controller.getPatientExistence);
router.post("/patientSave", controller.patientSave);
router.post("/update", controller.updateProfile);
router.post("/verifyOtp", controller.verifyOtp);
router.get("/getPatientBookings/:patient_id", controller.getPatientBookings);
router.get(
  "/getLastBookedDoctors/:patient_id",
  controller.getLastBookedDoctors
);
module.exports = router;
