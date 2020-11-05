"use strict";
const express = require("express");
const controller = require("./booking.controller");
const router = express.Router();
router.post("/delete", controller.deleteBooking);

module.exports = router;
