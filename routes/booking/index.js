"use strict";
const express = require("express");
const controller = require("./booking.controller");
const router = express.Router();
router.post("/delete", controller.deleteBooking);
router.post("/update", controller.updateBooking);
router.get("/appointment-detail/:id", controller.appointmentDetail);
module.exports = router;
