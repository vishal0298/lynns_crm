const express = require("express");
const router = express.Router();
const purchaseReturnTemplateController = require("../controllers/purchaseReturn_template.controller")


router.put(
    "/setDefaultPurchaseReturnTemplate",
    purchaseReturnTemplateController.updatePurchaseReturnTemplate
  );


router.get(
    "/viewDefaultPurchaseReturnTemplate",
    purchaseReturnTemplateController.viewPurchaseReturnTemplate
)

module.exports = router;