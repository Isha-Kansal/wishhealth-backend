"use strict";
const express = require("express");
const controller = require("./dataValues.controller");
const router = express.Router();

router.get("/degree", controller.getDegrees);
router.get("/college", controller.getColleges);
router.get("/states", controller.getStates);
router.get("/cities/:state_id", controller.getCities);
router.get("/languages", controller.getLanguages);
router.get("/specialities", controller.getSpecialities);
router.get("/services", controller.getServices);
router.get("/videos", controller.getVideos);
router.get("/faqs", controller.getFaqs);
router.get("/testimonials", controller.getTestimonials);
router.get("/council", controller.getCouncil);
router.get("/medicalShots", controller.medicalShots);
router.get("/featuredBlogs", controller.featuredBlogs);
router.get("/cities", controller.cities);

module.exports = router;
