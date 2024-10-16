const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const taxController = require("../controllers/tax.controller");
const taxValidator = require("../validations/tax.validator");
const deleteValidator = require("../../common/validators");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addTax",
  checkAccess.checkAccess("taxSettings", "create"),
  taxValidator.create,
  taxController.create
);
router.get(
  "/listTaxes",
  checkAccess.checkAccess("taxSettings", "view"),
  taxController.list
);
router.put(
  "/updateTax/:id",
  checkAccess.checkAccess("taxSettings", "update"),
  taxValidator.create,
  taxController.update
);
router.get(
  "/viewTax/:id",
  checkAccess.checkAccess("taxSettings", "view"),
  taxController.view
);
router.post(
  "/deleteTax",
  checkAccess.checkAccess("taxSettings", "delete"),
  deleteValidator._idValidator,
  taxController.delete
);

module.exports = router;
