const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const productsModel = require("../models/products.model");

exports.create = [
  body("type").trim().notEmpty().withMessage("is required"),
  body("name").trim().notEmpty().withMessage("is required"),
  body("sku").trim().notEmpty().withMessage("is required"),
  body("category").trim().notEmpty().withMessage("is required"),
  body("sellingPrice")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than 0")
    .toFloat()
    .custom((value, { req }) => {
      const purchasePrice = parseFloat(req.body.purchasePrice);
      if (value <= purchasePrice) {
        throw new Error("Selling price must not be less than purchase price");
      }
      return true;
    }),

  body("purchasePrice")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than 0")
    .toFloat(),
  body("quantity").trim().optional(),
  body("units").trim().notEmpty().withMessage("is required"),

  body("discountType")
    .optional()
    .custom((value) => {
      if (value) {
        if (value.toLowerCase() !== "2" && value.toLowerCase() !== "3") {
          throw new Error("DiscountType is required");
        }
      }
      return true;
    }),
  body("discountValue")
    .optional()
    .custom((value, { req }) => {
      if (value) {
        if (req.body.discountType.toLowerCase() === "2") {
          const discountValue = parseFloat(value);
          if (discountValue > 99) {
            throw new Error("Discount value must be less than 99.");
          }
        }
      }
      return true;
    }),

  body("Barcode").trim().optional(),
  body("alertQuantity")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than 0")
    .toFloat(),
  body("tax").trim().optional(),
  body("productDescription").trim().optional(),
  body("images").trim().optional(),
  // .custom((value, { req }) => {
  //   if (!req.file) {
  //     return Promise.reject("is required");
  //   }
  //   return true;
  // }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg);
      });
      data = {
        message: error_message,
      };
      response.validation_error_message(data, res, 403); // Added status code 403 for error response
    } else {
      next();
    }
  },
];

exports.update = [
  body("type").trim().notEmpty().withMessage("is required"),
  body("name").trim().notEmpty().withMessage("is required"),
  body("sku").trim().notEmpty().withMessage("is required"),
  body("category").trim().notEmpty().withMessage("is required"),
  body("sellingPrice")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than or equal to 0")
    .toFloat(),
  body("purchasePrice")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than or equal to 0")
    .toFloat(),
  body("units").trim().notEmpty().withMessage("is required"),
  body("discountType").optional(),
  body("barcode").trim().optional(),
  body("alertQuantity")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isFloat({ min: 0 })
    .withMessage("must be greater than or equal to 0")
    .toFloat(),
  body("tax").trim().optional(),
  body("productDescription").trim().optional(),
  body("images").optional(),
  // .custom(async (value, { req }) => {
  //   const imageRec = await productsModel.findById(req.params.id);
  //   if ((imageRec == null || !imageRec.images) && !req.file) {
  //     return Promise.reject("is required");
  //   }
  //   return true;
  // }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg);
      });
      data = {
        message: error_message,
      };
      response.validation_error_message(data, res, 403); // Added status code 403 for error response
    } else {
      next();
    }
  },
];
