const express = require("express");
const router = express.Router();
const stripeController = require("./../controllers/stripe.controller");

router.post("/stripePayment", stripeController.stripePaymentProcess);
router.post("/confirmPayment", stripeController.confirmPayment);
router.post("/webhook", stripeController.stripeWebhook);
router.post("/webhookPayment", stripeController.stripeWebhookPayment);

module.exports = router;
