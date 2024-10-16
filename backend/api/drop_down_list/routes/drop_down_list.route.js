const express = require("express");
const router = express.Router();
const dropDownController = require("../controllers/drop_down_list.controller");

router.get("/customer", dropDownController.customerList);
router.get("/vendor", dropDownController.vendorList);
router.get("/category", dropDownController.categoryList);
router.get("/unit", dropDownController.unitList);
router.get("/staff", dropDownController.staffList);
router.get("/product", dropDownController.productList);
router.get("/tax", dropDownController.taxList);
router.get("/bank", dropDownController.bankList);
router.get("/role", dropDownController.roleList);
router.get("/signature", dropDownController.signatureList);

module.exports = router;
