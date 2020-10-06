"use strict";
const express = require("express");
const controller = require("./search.controller");
const router = express.Router();
router.post("/searchDoctors", controller.searchDoctors);
router.post("/getClinicDetails", controller.getClinicDetails);

module.exports = router;
