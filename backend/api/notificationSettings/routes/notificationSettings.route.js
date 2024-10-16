const express = require('express');
const router = express.Router();

const notificationSettingsController = require('../controllers/notificationSettings.controller');
const notificationSettingsValidation = require('../validations/notificationSettings.validator');
const checkAccess = require("../../../middleware/permission.middleware");

router.put(
  '/updateNotificationSettings',
  checkAccess.checkAccess("notificationSettings", "update"),
  notificationSettingsValidation.updateNotificationSettings, 
  notificationSettingsController.updateNotificationSettings,
);
router.get(
  '/viewNotificationSettings',
  checkAccess.checkAccess("notificationSettings", "view"),
  notificationSettingsController.viewNotificationSettings
);

module.exports = router;
