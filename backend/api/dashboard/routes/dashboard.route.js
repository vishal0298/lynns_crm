const express = require("express");
const router = express.Router();
const dashboard = require("./../controllers/dashboard.controller");
const checkAccess = require("../../../middleware/permission.middleware");

router.get(
    "/", 
    checkAccess.checkAccess("dashboard", "view"),
    dashboard.dashboard
);

module.exports = router;
