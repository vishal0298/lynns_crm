const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/customers");
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

// Define middleware to resize the uploaded image using sharp
const resizeImage = async (req, res, next) => {
  if (req.file) {
    try {
      const imagePath = req.file.path;
      const resizedPath = imagePath.replace(
        path.extname(imagePath),
        "-resized" + path.extname(imagePath)
      );
      await sharp(imagePath).resize(40).toFile(resizedPath);
      fs.unlinkSync(imagePath);
      fs.renameSync(resizedPath, imagePath);
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

const customersController = require("../controllers/customers.controller");
const customersValidator = require("../validations/customers.validator");
const deleteValidator = require("../../common/validators");
const checkAccess = require("../../../middleware/permission.middleware");

// Define routes
router.post(
  "/addCustomer",
  uploadImage,
  resizeImage,
  checkAccess.checkAccess("customer", "create"),
  customersValidator.create,
  customersController.create
);
router.put(
  "/updateCustomer/:id",
  uploadImage,
  resizeImage,
  checkAccess.checkAccess("customer", "update"),
  customersValidator.update,
  customersController.update
);
router.post(
  "/deleteCustomer",
  checkAccess.checkAccess("customer", "delete"),
  deleteValidator._idValidator,
  customersController.delete
);
router.post(
  "/activateCustomer",
  checkAccess.checkAccess("customer", "update"),
  deleteValidator._idValidator,
  customersController.activateCustomer
);
router.post(
  "/deactivateCustomer",
  checkAccess.checkAccess("customer", "update"),
  deleteValidator._idValidator,
  customersController.deactivateCustomer
);
router.get(
  "/viewCustomer/:id",
  checkAccess.checkAccess("customer", "view"),
  customersController.view
);
router.get(
  "/listCustomers",
  checkAccess.checkAccess("customer", "view"),
  customersController.list
);
router.get("/CustomerWithInvoices", customersController.CustomerDetails);

module.exports = router;
