const express = require("express");
const router = express.Router();
const salesReturnTemplateController = require("../controllers/salesReturn_template.controller")


router.put(
    "/setDefaultSalesReturnTemplate",
    salesReturnTemplateController.updateSalesReturnTemplate
  );


router.get(
    "/viewDefaultSalesReturnTemplate",
    salesReturnTemplateController.viewSalesReturnTemplate
)

module.exports = router;