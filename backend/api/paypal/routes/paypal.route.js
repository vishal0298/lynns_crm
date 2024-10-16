const express = require("express");
const router = express.Router();
const paypalController = require("../controllers/paypal.controller");

router.post("/addPayment", paypalController.paypalTransaction);
router.post("/generateClientToken", paypalController.generateClientToken);
router.post("/executePayment", paypalController.executePayment);
router.post("/createOrder", paypalController.createOrder);
router.post("/capturePayment", paypalController.capturePayment);
router.post("/webhook", paypalController.paypalWebhook);

module.exports = router;
