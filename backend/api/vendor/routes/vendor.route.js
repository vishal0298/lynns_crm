const express = require("express");
const router = express.Router();
var multer = require("multer");
var uploads = multer();

const vendorController = require("../controllers/vendor.controller");
const vendorValidator = require("../validations/vendor.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addVendor",
  checkAccess.checkAccess("vendor", "create"),
  uploads.none(),
  vendorValidator.create,
  vendorController.create
);
router.get(
  "/listVendor",
  checkAccess.checkAccess("vendor", "view"),
  vendorController.list
);
router.put(
  "/updateVendor/:id",
  checkAccess.checkAccess("vendor", "update"),
  uploads.none(),
  vendorValidator.create,
  vendorController.update
);

router.get(
  "/viewVendor/:id",
  checkAccess.checkAccess("vendor", "view"),
  vendorController.view
);

// Soft delete vendor
router.patch(
  "/deleteVendor/:id",
  checkAccess.checkAccess("vendor", "delete"),
  vendorController.softDelete
);

module.exports = router;
