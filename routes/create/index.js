"use strict";
const express = require("express");
const controller = require("./create.controller");
const router = express.Router();
router.post("/createDoctor", controller.createDoctor);
module.exports = router;
