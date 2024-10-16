const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const debitnoteModel = require("../models/debit_note.model");

exports.create = [
  body("debit_note_id").trim().notEmpty().withMessage("is required"),
  body("vendorId").trim().notEmpty().withMessage("is required"),
  body("purchaseOrderDate").trim().notEmpty().withMessage("is required"),
  body("dueDate").trim().optional(),
  body("referenceNo").trim().optional(),
  body("paymentMode").trim().optional(),
  body("taxableAmount").trim().optional(),
  body("totalDiscount").trim().optional(),
  body("vat").trim().optional(),
  body("roundOff").trim().optional(),
  body("TotalAmount").trim().optional(),
  body("bank").trim().optional(),
  body("notes").trim().optional(),
  body("termsAndCondition").trim().optional(),
  body("items.*.productId").trim().notEmpty().withMessage("is required"),
  body("items.*.name").trim().notEmpty().withMessage("is required"),
  body("items.*.quantity").trim().notEmpty().withMessage("is required"),
  body("items.*.unit").trim().notEmpty().withMessage("is required"),
  body("items.*.rate").trim().notEmpty().withMessage("is required"),
  body("items.*.discount").trim().notEmpty().withMessage("is required"),
  body("items.*.tax").trim().notEmpty().withMessage("is required"),
  body("items.*.amount").trim().notEmpty().withMessage("is required"),
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
      if (req.body._id) {
        const imageRec = await debitnoteModel.findById(req.body._id);
        if ((imageRec == null || !imageRec.signatureImage) && !req.file) {
          return Promise.reject("is required");
        }
      } else {
        if (!req.file) {
          return Promise.reject("is required");
        }
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
      data = { message: error_message };
      response.validation_error_message(data, res);
    } else {
      next();
    }
  },
];
