const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path")

const signatureController = require("../controllers/signature.controller");
const signatureValidator = require("../validations/signature.validator");



const uploadImage = async (req, res, next) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./uploads/signatures");
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
              "Only files with the following extensions are allowed: png,jpg "
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
  



//Add Data
router.post(
  "/addSignature",
  uploadImage,
  signatureValidator.create,
  signatureController.create
);


//Update signature
router.put(
  "/updateSignature/:id",
  uploadImage,
 signatureController.update
);

//signature list
router.get(
  "/list",
  signatureController.list
);


//Delete signature
router.patch(
  "/deleteSignature/:id",
  signatureController.softDelete
);


//Status update
router.put(
  "/update_status/:id",
  signatureController.update_status
);

module.exports = router;
