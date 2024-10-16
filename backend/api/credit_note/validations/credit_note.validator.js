const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const { Promise } = require("mongoose");
const creditnoteModel = require("../models/credit_note.model");

exports.create = [
  body("customerId").trim().notEmpty().withMessage("is required"),
  body("credit_note_date").trim().notEmpty().withMessage("is required"),
  body("credit_note_id").trim().notEmpty().withMessage("is required"),
  body("due_date").trim().optional(),
  body("reference_no").trim().optional(),
  body("items.*.productId").trim().notEmpty().withMessage("is required"),
  body("items.*.quantity").trim().notEmpty().withMessage("is required"),
  body("items.*.unit").trim().notEmpty().withMessage("is required"),
  body("items.*.rate").trim().notEmpty().withMessage("is required"),
  body("items.*.discount").trim().notEmpty().withMessage("is required"),
  body("items.*.tax").trim().notEmpty().withMessage("is required"),
  body("items.*.amount").trim().notEmpty().withMessage("is required"),
  body("discountType").optional(),
  body("status").optional(),
  body("paymentMode").optional(),
  body("discount").optional(),
  body("tax").optional(),
  body("taxableAmount").trim().notEmpty().withMessage("is required"),
  body("totalDiscount").trim().notEmpty().withMessage("is required"),
  body("vat").trim().notEmpty().withMessage("is required"),
  body("roundOff").trim().notEmpty().withMessage("is required"),
  body("TotalAmount").trim().notEmpty().withMessage("is required"),
  body("bank").trim().optional(),
  body("notes").trim().optional(),
  body("termsAndCondition").trim().optional(),
  body("sign_type")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["manualSignature", "eSignature"])
    .withMessage("is invalid"),

  body("signatureId")
    .if(body("sign_type").equals("manualSignature"))
    .notEmpty()
    .withMessage("is required"),
  body("signatureName")
    .if(body("sign_type").equals("eSignature"))
    .notEmpty()
    .withMessage("is required"),
  body("signatureImage")
    .if(body("sign_type").equals("eSignature"))
    .custom((value, { req }) => {
      if (!req.file) {
        return Promise.reject("is required");
      }
      return true;
    }),

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
      response.validation_error_message(data, res);
    } else {
      next();
    }
  },
];

exports.update = [
  body("customerId").trim().notEmpty().withMessage("is required"),
  body("credit_note_date").trim().notEmpty().withMessage("is required"),
  body("credit_note_id").trim().notEmpty().withMessage("is required"),
  body("due_date").trim().optional(),
  body("reference_no").trim().optional(),
  body("items.*.productId").trim().notEmpty().withMessage("is required"),
  body("items.*.quantity").trim().notEmpty().withMessage("is required"),
  body("items.*.unit").trim().notEmpty().withMessage("is required"),
  body("items.*.rate").trim().notEmpty().withMessage("is required"),
  body("items.*.discount").trim().notEmpty().withMessage("is required"),
  body("items.*.tax").trim().notEmpty().withMessage("is required"),
  body("items.*.amount").trim().notEmpty().withMessage("is required"),
  body("discountType").optional(),
  body("status").optional(),
  body("paymentMode").optional(),
  body("discount").optional(),
  body("tax").optional(),
  body("taxableAmount").trim().notEmpty().withMessage("is required"),
  body("totalDiscount").trim().notEmpty().withMessage("is required"),
  body("vat").trim().notEmpty().withMessage("is required"),
  body("roundOff").trim().notEmpty().withMessage("is required"),
  body("TotalAmount").trim().notEmpty().withMessage("is required"),
  body("bank").trim().optional(),
  body("notes").trim().optional(),
  body("termsAndCondition").trim().optional(),
  body("sign_type")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["manualSignature", "eSignature"])
    .withMessage("is invalid"),

  body("signatureId")
    .if(body("sign_type").equals("manualSignature"))
    .notEmpty()
    .withMessage("is required"),
  body("signatureName")
    .if(body("sign_type").equals("eSignature"))
    .notEmpty()
    .withMessage("is required"),
  body("signatureImage")
    .if(body("sign_type").equals("eSignature"))
    .custom(async (value, { req }) => {
      const imageRec = await creditnoteModel.findById(req.params.id);
      if ((imageRec == null || !imageRec.signatureImage) && !req.file) {
        return Promise.reject("is required");
      }
      return true;
    }),

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
      response.validation_error_message(data, res);
    } else {
      next();
    }
  },
];
