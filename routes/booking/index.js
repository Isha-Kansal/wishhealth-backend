"use strict";
const express = require("express");
const controller = require("./booking.controller");
const router = express.Router();
router.post("/delete", controller.deleteBooking);
router.post("/update", controller.updateBooking);
module.exports = router;