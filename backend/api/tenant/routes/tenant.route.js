const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenant.controller");
router.post("/addTenant", tenantController.addTenant);
router.post("/viewTenant", tenantController.viewTenant);

module.exports = router;
