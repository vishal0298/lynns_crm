const express = require("express");
const unauthorizedAPIsController = require("../controllers/unauthorized_apis.controller");

const router = express.Router();

router.get("/companysettings", unauthorizedAPIsController.companyImages);
router.get("/sentPaymentLinks", unauthorizedAPIsController.sentPaymentLinks);
router.get("/viewInvoice", unauthorizedAPIsController.viewInvoice);
router.get("/paymentSettingsDetails", unauthorizedAPIsController.paymentSettingsDetails);

module.exports = router;
