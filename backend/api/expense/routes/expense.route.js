const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const verify = require("../../../verify.token");
const fs = require("fs");
const path = require("path");
const resizeImage = async (req, res, next) => {
  if (req.files) {
    try {
      const imagePath = req.files[0].path;
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

const uploadImage = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/expenses");
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

  const uploadSingleImage = upload.single("attachment");
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

const expenseController = require("../controllers/expense.controller");
const expenseValidator = require("../validations/expense.validator");
const deleteValidator = require("../../common/validators");
const checkAccess = require("../../../middleware/permission.middleware");

router.post(
  "/addExpense",
  checkAccess.checkAccess("expense", "create"),
  uploadImage,
  expenseValidator.create,
  expenseController.create
);
router.get(
  "/listExpenses",
  checkAccess.checkAccess("expense", "view"),
  expenseController.list
);
router.put(
  "/updateExpense/:id",
  checkAccess.checkAccess("expense", "update"),
  uploadImage,
  expenseValidator.update,
  expenseController.update
);
router.get(
  "/viewExpense/:id",
  checkAccess.checkAccess("expense", "view"),
  expenseController.view
);

router.post(
  "/deleteExpense",
  checkAccess.checkAccess("expense", "delete"),
  deleteValidator._idValidator,
  expenseController.delete
);

router.get("/getExpenseNumber", expenseController.getExpenseNumber);

//Soft delete a expense

module.exports = router;
