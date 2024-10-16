const express = require("express");
const router = express.Router();
const invoiceSettingController = require("../controllers/invoiceSettings.Controller");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const verify = require("../../../verify.token");


const uploadImage = async (req, res, next) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/invoiceSettings");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
          fileSize: 1024 * 1024 * 5,
          files: 2 // 5 MB
        },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error('Only files with the following extensions are allowed: png,jpg,jpeg '));
        }
    }
});

const uploadMultipleImage = upload.fields([{name: "invoiceLogo"},{name: "digitalSignatureImage"}]);

uploadMultipleImage(req, res, function (err) {
  if (err) {
      data = {
        message: err.message,
      };
      return response.validation_error_message(data, res);
  }
  next();
});
 
};


const checkAccess = require("../../../middleware/permission.middleware");
const invoiceSettingsValidator = require("../validations/invoiceSetting.validator")

router.put(
  "/updateInvoiceSetting",
  checkAccess.checkAccess("invoiceSettings", "update"),
  uploadImage,
  invoiceSettingsValidator.update,
  invoiceSettingController.updateInvoiceSetting
);
router.get(
  "/viewInvoiceSetting", 
  checkAccess.checkAccess("invoiceSettings", "view"),
  invoiceSettingController.viewInvoiceSetting
);

module.exports = router;
