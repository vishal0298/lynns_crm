const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const staffController = require("../controllers/staff.controller");
const staffValidator = require("../validations/staff.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/",
  checkAccess.checkAccess("staff", "create"),
  upload.none(),
  staffValidator.create,
  staffController.create
);

router.get(
  "/staffList",
  checkAccess.checkAccess("staff", "view"),
  staffController.list
);

router.put(
  "/:id",
  checkAccess.checkAccess("staff", "update"),
  upload.none(),
  staffValidator.create,
  staffController.update
);

router.get(
  "/viewStaff/:id",
  checkAccess.checkAccess("staff", "view"),
  staffController.view
);

// Routes to SoftDelete data
router.patch(
  "/delete/:id",
  checkAccess.checkAccess("staff", "delete"),
  staffController.softDelete
);

module.exports = router;
