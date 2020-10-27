"use strict";
const express = require("express");
const controller = require("./S3.controller");

const router = express.Router();

router.post("/uploadImage", controller.uploadImage);

module.exports = router;
