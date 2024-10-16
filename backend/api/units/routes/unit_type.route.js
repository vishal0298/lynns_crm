const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const unit_typeController = require("../controllers/unit_type.controller");
const unit_typeValidator = require("../validations/unit_type.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/",
  checkAccess.checkAccess("unit", "create"),
  upload.none(),
  unit_typeValidator.create,
  unit_typeController.create
);
router.get(
  "/unitList",
  checkAccess.checkAccess("unit", "view"),
  unit_typeController.list
);
router.put(
  "/:id",
  checkAccess.checkAccess("unit", "update"),
  upload.none(),
  unit_typeValidator.create,
  unit_typeController.update
);
router.get(
  "/viewUnit/:id",
  checkAccess.checkAccess("unit", "view"),
  unit_typeController.view
);

// Routes to SoftDelete data
router.patch(
  "/delete/:id",
  checkAccess.checkAccess("unit", "delete"),
  unit_typeController.softDelete
);

module.exports = router;
