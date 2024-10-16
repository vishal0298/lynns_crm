const express = require('express');
const router = express.Router();
const { updatePaymentSettingValidation } = require('../validations/paymentSettings.validator');
const paymentController = require('../controllers/paymentSettings.controller');
const checkAccess = require("../../../middleware/permission.middleware");

router.put(
    "/updatePaymentSettings", 
    checkAccess.checkAccess("paymentSettings", "update"),
    updatePaymentSettingValidation, 
    paymentController.updatePaymentSetting
);
router.get(
    "/viewPaymentSetting", 
    checkAccess.checkAccess("paymentSettings", "view"),
    paymentController.viewPaymentSetting
);



module.exports = router;
