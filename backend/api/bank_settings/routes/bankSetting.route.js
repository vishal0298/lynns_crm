const express = require("express");
const router = express.Router();
const bankSettingController = require("../controllers/bank_settings.controller");
const bankSettingValidator = require("../validations/banksettings.validator");
const deleteValidator = require("../../common/validators");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addBank",
  checkAccess.checkAccess("bankSettings", "create"),
  bankSettingValidator.create,
  bankSettingController.addBank
);
router.put(
  "/updateBank/:id",
  checkAccess.checkAccess("bankSettings", "update"),
  bankSettingValidator.update,
  bankSettingController.updateBank
);
router.get(
  "/listBanks",
  checkAccess.checkAccess("bankSettings", "view"),
  bankSettingController.listBank
);
router.get(
  "/viewBank/:id",
  checkAccess.checkAccess("bankSettings", "view"),
  bankSettingController.viewBank
);
router.post(
  "/deleteBank",
  checkAccess.checkAccess("bankSettings", "delete"),
  deleteValidator._idValidator,
  bankSettingController.deleteBank
);

module.exports = router;
