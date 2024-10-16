const { body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("invoiceId").trim().notEmpty().withMessage("is required"),
  body("due_amount").trim().optional(),
  body("received_on").trim().optional(),
  body("payment_method")
    .trim()
    .notEmpty()
    .isIn(["Cash", "Upi", "Card", "Membership"])
    .withMessage("is Invalid"),
  body("amount").trim().notEmpty().withMessage("is required"),
  body("notes").trim().optional(),
  body("status")
    .trim()
    .optional()
    .isIn(["Success", "Pending", "Failed", "Processing"])
    .withMessage("is Invalid"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg);
        // error_message +=  errorsList.param+" " + errorsList.msg + ", ";
      });
      // error_message = error_message.replace(/,\s*$/, "");
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
    .isIn(["Success", "Pending", "Failed", "Processing"])
    .withMessage("is Invalid"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg);
        // error_message +=  errorsList.param+" " + errorsList.msg + ", ";
      });
      // error_message = error_message.replace(/,\s*$/, "");
      data = {
        message: error_message,
      };
      response.validation_error_message(data, res);
    } else {
      next();
    }
  },
];
