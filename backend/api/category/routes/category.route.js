const express = require("express");
const router = express.Router();
const multer = require("multer");
const verify = require("../../../verify.token");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/category");
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
      fileSize: 1024 * 1024 * 50, // 50 MB
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

  const uploadSingleImage = upload.single("image");

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

const resizeImages = async (req, res, next) => {
  if (req.files) {
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize({ width: 40 })
          .toFile(file.path.replace(/(?=\.[^.]+$)/, "-resized"));

        // Delete the original image
        fs.unlinkSync(file.path);

        // Rename the resized image to the original filename
        fs.renameSync(file.path.replace(/(?=\.[^.]+$)/, "-resized"), file.path);
      })
    );
  }
  next();
};

const categoryController = require("../controllers/category.controller");
const categoryValidator = require("../validations/category.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/",
  checkAccess.checkAccess("category", "create"),
  uploadImage,
  resizeImages,
  categoryValidator.create,
  categoryController.create
);

router.get(
  "/",
  checkAccess.checkAccess("category", "view"),
  categoryController.list
);
router.get(
  "/:id",
  checkAccess.checkAccess("category", "view"),
  categoryController.view
);
router.put(
  "/:id",
  checkAccess.checkAccess("category", "update"),
  uploadImage,
  resizeImages,
  categoryValidator.update,
  categoryController.update
);
router.patch(
  "/:id",
  checkAccess.checkAccess("category", "delete"),
  categoryController.softDelete
);

module.exports = router;
