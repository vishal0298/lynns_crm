const express = require("express");
const router = express.Router();
const invoiceTemplateController = require("../controllers/invoice_template.controller")


router.put(
    "/setDefaultInvoiceTemplate",
    invoiceTemplateController.updateInvoiceTemplate
  );


router.get(
    "/viewDefaultInvoiceTemplate",
    invoiceTemplateController.viewInvoiceTemplate
)

module.exports = router;