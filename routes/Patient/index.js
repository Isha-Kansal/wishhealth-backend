"use strict";
const express = require("express");
const controller = require("./patient.controller");
const router = express.Router();
router.post("/getPatientExistence", controller.getPatientExistence);

module.exports = router;
