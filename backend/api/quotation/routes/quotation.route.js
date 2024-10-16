const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/quotation");
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
      fileSize: 1024 * 1024 * 5, // 5 MB
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

  const uploadSingleImage = upload.single("signatureImage");
  uploadSingleImage(req, res, function (err) {
    if (err) {
      data = {
        message: err.message,
      };
      return response.validation_error_message(data, res);
    }
    next();
  });
};

// Middleware for resizing uploaded images
const resizeImages = async (req, res, next) => {
  try {
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          await sharp(file.path)
            .resize({ width: 40 })
            .toFile(file.path.replace(/(?=\.[^.]+$)/, "-resized"));

          // Delete the original image
          fs.unlinkSync(file.path);

          // Rename the resized image to the original filename
          fs.renameSync(
            file.path.replace(/(?=\.[^.]+$)/, "-resized"),
            file.path
          );
        })
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

const quotationController = require("../controllers/quotation.controller");
const quotationValidator = require("../validations/quotation.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addQuotation",
  checkAccess.checkAccess("quotation", "create"),
  uploadImage,
  resizeImages,
  quotationValidator.create,
  quotationController.create
);

router.put(
  "/:id",
  checkAccess.checkAccess("quotation", "update"),
  uploadImage,
  resizeImages,
  quotationValidator.update,
  quotationController.update
);

router.post(
  "/convertInvoice",
  checkAccess.checkAccess("quotation", "create"),
  quotationController.convertToInvoice
);

router.post(
  "/cloneQuotation",
  checkAccess.checkAccess("quotation", "create"),
  quotationController.cloneQuotation
);

router.get(
  "/viewQuotation/:id",
  checkAccess.checkAccess("quotation", "view"),
  quotationController.view
);
router.get(
  "/quotationList",
  checkAccess.checkAccess("quotation", "view"),
  quotationController.list
);
router.patch(
  "/deleteQuotation/:id",
  checkAccess.checkAccess("quotation", "delete"),
  quotationController.softDelete
);

router.get("/getQuotationNumber", quotationController.getQuotationNumber);

//export the module
module.exports = router;
