const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");

router.get("/viewPermission/:id", permissionController.viewPermissions);
router.put("/updatePermissions/:id", permissionController.updatePermission);

module.exports = router;
