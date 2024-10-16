const express = require("express");
const router = express.Router();
const purchaseTemplateController = require("../controllers/purchase_template.controller")


router.put(
    "/setDefaultPurchaseTemplate",
    purchaseTemplateController.updatePurchaseTemplate
  );


router.get(
    "/viewDefaultPurchaseTemplate",
    purchaseTemplateController.viewPurchaseTemplate
)

module.exports = router;