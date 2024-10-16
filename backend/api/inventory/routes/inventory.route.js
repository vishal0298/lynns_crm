const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const inventoryValidator = require("../validations/inventory.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addStock",
  checkAccess.checkAccess("inventory", "create"),
  inventoryValidator.create,
  inventoryController.create
);
router.put(
  "/removeStock",
  checkAccess.checkAccess("inventory", "update"),
  inventoryController.update
);
router.get(
  "/inventoryList",
  checkAccess.checkAccess("inventory", "view"),
  inventoryController.list
);

router.patch(
  "/deleteInventory/:id",
  checkAccess.checkAccess("inventory", "delete"),
  inventoryController.softDelete
);

module.exports = router;
