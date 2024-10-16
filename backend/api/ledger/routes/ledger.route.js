const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const ledgerController = require("../controllers/ledger.controller");
const ledgerValidator = require("../validations/ledger.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addData",
  checkAccess.checkAccess("ledger", "create"),
  upload.none(),
  ledgerValidator.create,
  ledgerController.create
);

router.get(
  "/getAllData",
  checkAccess.checkAccess("ledger", "view"),
  ledgerController.list
);

router.get(
  "/getById/:id",
  checkAccess.checkAccess("ledger", "view"),
  ledgerController.view
);

router.put(
  "/:id",
  checkAccess.checkAccess("ledger", "update"),
  ledgerController.update
);

router.patch(
  "/:id/softDelete",
  checkAccess.checkAccess("ledger", "delete"),
  ledgerController.softDelete
);

module.exports = router;
