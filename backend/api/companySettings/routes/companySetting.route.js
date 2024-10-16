const express = require("express");
const router = express.Router();
const CompanySettingController = require("../controllers/companySettings.controller");
const verify = require("../../../verify.token");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/companySettings");
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
      files: 3, // 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        return cb(
          new Error(
            "Only files with the following extensions are allowed: png,jpg,jpeg "
          )
        );
      }
    },
  });

  const uploadMultipleImage = upload.fields([
    { name: "siteLogo" },
    { name: "favicon" },
    { name: "companyLogo" },
  ]);

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

const companySettingsvalidator = require("../validations/companySetting.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.put(
  "/updateCompanySetting",
  checkAccess.checkAccess("companySettings", "update"),
  uploadImage,
  companySettingsvalidator.update,
  CompanySettingController.updateCompanySetting
);
router.get(
  "/viewCompanySetting",
  checkAccess.checkAccess("companySettings", "view"),
  CompanySettingController.viewCompanySetting
);

module.exports = router;
