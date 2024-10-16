const { body, validationResult, query, param } = require("express-validator");
const response = require("../../../response");
const invoiceModel = require("../models/invoice.model");

exports.create = [
  body("customerId").trim().notEmpty().withMessage("is required"),
  body("invoiceDate").trim().notEmpty().withMessage("is required"),
  body("dueDate").trim().notEmpty().withMessage("is required"),
  body("status")
    .trim()
    .optional()
    .isIn([
      "PAID",
      "OVERDUE",
      "CANCELLED",
      "PARTIALLY_PAID",
      "UNPAID",
      "REFUND",
      "DRAFTED",
    ])
    .withMessage("is Invalid"),
  body("referenceNo").trim().optional(),
  body("payment_method").notEmpty().withMessage("is required"),
  body("isRecurring").trim().notEmpty().withMessage("is required"),
  body("taxableAmount").trim().notEmpty().withMessage("is required"),
  body("totalDiscount").trim().notEmpty().withMessage("is required"),
  body("vat").trim().notEmpty().withMessage("is required"),
  body("roundOff").trim().notEmpty().withMessage("is required"),
  body("TotalAmount").trim().notEmpty().withMessage("is required"),
  body("bank").trim().optional(),
  body("notes").trim().optional(),
  body("termsAndCondition").trim().optional(),
  // body("sign_type")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("is required")
  //   .isIn(["manualSignature", "eSignature"])
  //   .withMessage("is invalid"),
  // body("signatureId")
  //   .if(body("sign_type").equals("manualSignature"))
  //   .notEmpty()
  //   .withMessage("is required"),
  // body("signatureName")
  //   .if(body("sign_type").equals("eSignature"))
  //   .notEmpty()
  //   .withMessage("is required"),
  body("invoice_items.*.productId")
    .trim()
    .notEmpty()
    .withMessage("is required"),
  body("invoice_items.*.productName")
    .trim()
    .notEmpty()
    .withMessage("is required"),
  body("invoice_items.*.quantity").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.unitId").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.unit").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.rate").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.discount").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.tax").trim().notEmpty().withMessage("is required"),
  body("invoice_items.*.amount").trim().notEmpty().withMessage("is required"),
  // body("signatureImage")
  //   .if(body("sign_type").equals("eSignature"))
  //   .custom(async (value, { req }) => {
  //     if (req.body._id) {
  //       const imageRec = await invoiceModel.findById(req.body._id);
  //       if ((imageRec == null || !imageRec.signatureImage) && !req.file) {
  //         return Promise.reject("is required");
  //       }
  //     } else {
  //       if (!req.file) {
  //         return Promise.reject("is required");
  //       }
  //     }
  //     return true;
  //   }),
  
  // New validations for staff and service_from fields
  body("staff").trim().optional().notEmpty().withMessage("is required"),
  body("service_from").trim().optional().notEmpty().withMessage("is required"),

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

exports.update_status = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["DRAFTED", "SENT", "APPROVED", "OVERDUE", "PAID"])
    .withMessage("is Invalid"),

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

exports.prodcutorservice = [
  query("category")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["PRODUCT", "SERVICE"])
    .withMessage("is Invalid"),

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

exports.convertToSalesReturn = [
  param("id")
    .notEmpty()
    .withMessage("is required")
    .custom(async (id) => {
      const invoiceRecord = await invoiceModel.findById(id);
      if (invoiceRecord.isSalesReturned) {
        throw new Error(
          " : Invoice converted to sales return already, Please check with another InvoiceId"
        );
      } else {
        return;
      }
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
