const express = require("express");
const router = express.Router();
const purchaseOrderTemplateController = require("../controllers/purchaseOrd_template.controller")


router.put(
    "/setDefaultPurchaseOrderTemplate",
    purchaseOrderTemplateController.updatePurchaseOrderTemplate
  );


router.get(
    "/viewDefaultPurchaseOrderTemplate",
    purchaseOrderTemplateController.viewPurchaseOrderTemplate
)

module.exports = router;