"use strict";
const express = require("express");
const controller = require("./payment");
const router = express.Router();
router.post("/", controller.createCharge);
router.post("/:paymentId/:amount", controller.paymentCapture);
module.exports = router;