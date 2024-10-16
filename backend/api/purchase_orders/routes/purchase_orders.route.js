// const express = require('express');
// const router = express.Router();

// const purchase_ordersController = require('../controllers/purchase_orders.controller');
// const purchase_ordersValidator = require('../validations/purchase_orders.validator');

// // Filter Purchase Orders
// router.get('/filterByVendor', purchase_ordersController.filterByVendor)
// router.get('/filterByPurchaseId', purchase_ordersController.filterByPurchaseId)

// router.post('/',purchase_ordersValidator.create,purchase_ordersController.create);
// router.get('/',purchase_ordersController.list);
// router.put('/:id',purchase_ordersValidator.create,purchase_ordersController.update);
// router.get('/:id',purchase_ordersController.view);
// router.delete('/:id',purchase_ordersController.delete);

// // Soft delete a purchase order
// router.patch('/:id/softdelete', purchase_ordersController.softDelete);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const purchase_ordersController = require("../controllers/purchase_orders.controller");
const purchase_ordersValidator = require("../validations/purchase_orders.validator");
const checkAccess = require("../../../middleware/permission.middleware");

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/purchase_orders");
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

// Convert to purchase
router.post(
  "/convert",
  checkAccess.checkAccess("purchaseOrder", "create"),
  uploadImage,
  resizeImages,
  purchase_ordersController.convertToPurchase
);

//Clone Purchase Order
router.post(
  "/purchaseOrders/:id/clone",
  checkAccess.checkAccess("purchaseOrder", "create"),
  purchase_ordersController.clonePurchaseOrder
);

// Filter Purchase Orders
router.post("/filterByVendor", purchase_ordersController.filterByVendor);
router.get(
  "/filterByPurchaseOrderId",
  purchase_ordersController.filterByPurchaseOrderId
);

//Add Data
router.post(
  "/addPurchaseOrder",
  checkAccess.checkAccess("purchaseOrder", "create"),
  uploadImage,
  resizeImages,
  purchase_ordersValidator.create,
  purchase_ordersController.create
);

//Get All Data
router.get(
  "/getAllData",
  checkAccess.checkAccess("purchaseOrder", "view"),
  purchase_ordersController.list
);

//Update Existing Data
router.put(
  "/:id",
  checkAccess.checkAccess("purchaseOrder", "update"),
  uploadImage,
  resizeImages,
  purchase_ordersValidator.update,
  purchase_ordersController.update
);

router.get(
  "/getPurchaseOrderNumber",
  purchase_ordersController.getPurchaseOrderNumber
);

router.get(
  "/:id",
  checkAccess.checkAccess("purchaseOrder", "view"),
  purchase_ordersController.view
);

//router.delete("/:id", purchase_ordersController.delete);

// Soft delete a purchase order
router.patch(
  "/:id/softdelete",
  checkAccess.checkAccess("purchaseOrder", "delete"),
  purchase_ordersController.softDelete
);

module.exports = router;
