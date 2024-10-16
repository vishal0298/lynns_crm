const reports_controller = require("../controllers/reports.controller");
const express = require("express");
const router = express.Router();
const checkAccess = require("../../../middleware/permission.middleware");

router.get("/customer_report", reports_controller.customer_report);
// router.get("/sales_report", reports_controller.sales_report);
router.get("/balance_sheet_report", reports_controller.balance_sheet_report);
router.get("/cash_flow_report", reports_controller.cash_flow_report);
router.get(
  "/delivery_challan_report",
  reports_controller.delivery_challan_report
);
router.get(
  "/quotation_report", 
  checkAccess.checkAccess("quotationReport", "view"),
  reports_controller.quotation_report
);
router.get("/filterQuotation", reports_controller.filterQuotation);

module.exports = router;
