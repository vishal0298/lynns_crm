const express = require("express");
const router = express.Router();
const rolesController = require("./../controllers/roles.controller");
const common = require("../../common/common");
const checkAccess = require("../../../middleware/permission.middleware");
const rolevalidator = require("../validations/role.validator");

router.post(
  "/addRole",
  rolevalidator.create,
  checkAccess.checkAccess("role", "create"),
  rolesController.addRole
);
router.put(
  "/updateRole/:id",
  checkAccess.checkAccess("role", "update"),
  rolevalidator.create,
  rolesController.updateRole
);
router.get(
  "/getRoles",
  checkAccess.checkAccess("role", "view"),
  rolesController.getRoles
);

//router.get("/viewPermission", rolesController.viewPermissions);

module.exports = router;
