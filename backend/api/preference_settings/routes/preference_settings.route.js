const express = require("express");
const router = express.Router();
const preferenceController = require("../controllers/preference_settings.controller");
const preferenceValidator = require("../validations/preference_settings.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.put(
  "/updatePrefernce",
  checkAccess.checkAccess("preferenceSettings", "update"),
  preferenceValidator.updatePreferenceValidation,
  preferenceController.updatePreference
);
router.get(
  "/viewPreference",
  checkAccess.checkAccess("preferenceSettings", "view"),
  preferenceController.viewPreferences
);


module.exports = router;

