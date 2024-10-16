const express = require("express");
const router = express.Router();
var multer = require("multer");
var uploads = multer();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/invoices");
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

const invoiceController = require("../controllers/invoice.controller");
const invoiceValidator = require("../validations/invoice.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/",
  uploadImage,
  resizeImage,
  checkAccess.checkAccess("invoice", "create"),
  invoiceValidator.create,
  invoiceController.create
);
router.get(
  "/customer-list",
  checkAccess.checkAccess("invoice", "view"),
  invoiceController.customer_list
);
router.get(
  "/invoiceCard",
  checkAccess.checkAccess("invoice", "view"),
  invoiceController.cardCount
);
router.get(
  "/staffRevenue",
  invoiceController.getStaffRevenue
);
router.get("/getInvoiceNumber", invoiceController.getInvoiceNumber);

router.get(
  "/",
  checkAccess.checkAccess("invoice", "view"),
  invoiceController.list
);
router.get(
  "/pdfCreate",
  checkAccess.checkAccess("invoice", "create"),
  invoiceController.sendPdf
);
router.put(
  "/update_status/:id",
  checkAccess.checkAccess("invoice", "update"),
  uploads.none(),
  invoiceValidator.update_status,
  invoiceController.update_status
);
router.put(
  "/updateInvoice/:id",
  checkAccess.checkAccess("invoice", "update"),
  uploadImage,
  resizeImage,
  invoiceController.update
);
//Clone Invoice
router.post(
  "/:id/clone",
  checkAccess.checkAccess("invoice", "create"),
  invoiceController.cloneInvoice
);
router.post(
  "/:id/convertsalesreturn",
  checkAccess.checkAccess("invoice", "create"),
  invoiceValidator.convertToSalesReturn,
  invoiceController.convertsalesreturn
);
router.post(
  "/generateDeliveryChallan/:id",
  checkAccess.checkAccess("deliveryChallan", "create"),
  invoiceController.generateDeliveryChallans
);
router.get(
  "/:id",
  checkAccess.checkAccess("invoice", "view"),
  invoiceController.view
);
router.patch(
  "/:id/softDelete",
  checkAccess.checkAccess("invoice", "delete"),
  invoiceController.softDelete
);

// router.delete('/:id',invoiceController.delete);

router.put("/recurringUpdate/:id", invoiceController.convertRecurringInvoice);

module.exports = router;
