'use strict';
const express = require('express');
const controller = require('./clinic.controller');
const router = express.Router();

router.get('/doctorsAllClinics/:id', controller.doctorsAllClinics);

module.exports = router;
