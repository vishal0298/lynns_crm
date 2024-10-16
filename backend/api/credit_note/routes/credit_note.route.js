const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const creditNoteController = require("../controllers/credit_note.controller");
const creditNoteValidator = require("../validations/credit_note.validator");
const checkAccess = require("../../../middleware/permission.middleware");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/credit_notes");
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

router.post(
  "/addCreditNote",
  checkAccess.checkAccess("creditNote", "create"),
  uploadImage,
  resizeImages,
  creditNoteValidator.create,
  creditNoteController.create
);

router.put(
  "/updateCreditNote/:id",
  checkAccess.checkAccess("creditNote", "update"),
  uploadImage,
  resizeImages,
  creditNoteValidator.update,
  creditNoteController.update
);

// Convert to delivery challan
router.post(
  "/convert",
  checkAccess.checkAccess("creditNote", "create"),
  resizeImages,
  creditNoteController.convertToDeliveryChallan
);

router.get(
  "/viewCreditNote/:id",
  checkAccess.checkAccess("creditNote", "view"),
  creditNoteController.view
);
router.get(
  "/creditNoteList",
  checkAccess.checkAccess("creditNote", "view"),
  creditNoteController.list
);
router.patch(
  "/deleteCreditNote/:id",
  checkAccess.checkAccess("creditNote", "delete"),
  creditNoteController.softDelete
);

router.get("/getCreditNoteNumber", creditNoteController.getCreditNotesNumber);

//export the module
module.exports = router;
