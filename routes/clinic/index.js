'use strict';
const express = require('express');
const controller = require('./clinic.controller');
const router = express.Router();

router.get('/doctors-clinics/:id', controller.doctorClinics);

module.exports = router;
