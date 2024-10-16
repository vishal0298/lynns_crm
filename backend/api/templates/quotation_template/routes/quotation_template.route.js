const express = require("express");
const router = express.Router();
const quotationTemplateController = require("../controllers/quotation_template.controller")


router.put(
    "/setDefaultQuotationTemplate",
    quotationTemplateController.updateQuotationTemplate
  );


router.get(
    "/viewDefaultQuotationTemplate",
    quotationTemplateController.viewQuotationTemplate
)

module.exports = router;