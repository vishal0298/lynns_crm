const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const checkAccess = require("../../../middleware/permission.middleware");
const paymentValidator = require("../validations/payment.validator");

router.post(
  "/addPayment",
  checkAccess.checkAccess("payment", "create"),
  paymentValidator.create,
  paymentController.create
);

router.put(
  "/update_status/:id",
  checkAccess.checkAccess("payment", "update"),
  paymentValidator.update_status,
  paymentController.update_status
);

router.patch(
  "/deletePayment/:id",
  checkAccess.checkAccess("payment", "delete"),
  paymentController.softDelete
);

router.get(
  "/paymentList",
  checkAccess.checkAccess("payment", "view"),
  paymentController.list
);

router.get(
  "/viewPayment/:id",
  checkAccess.checkAccess("payment", "view"),
  paymentController.view
);

module.exports = router;
