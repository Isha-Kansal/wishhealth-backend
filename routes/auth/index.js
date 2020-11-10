const express = require("express");
const controller = require("./auth.controller");
const router = express.Router();

router.post("/login", controller.login);
router.get("/checkDocPhnMailUsrname", controller.checkDocPhnMailUsrname);

module.exports = router;
