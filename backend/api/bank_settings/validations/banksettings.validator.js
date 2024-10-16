const { body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("name").trim().notEmpty().withMessage("is required").isLength({ max: 75 }).withMessage('should not exceed 20 characters'),
  body("bankName").trim().notEmpty().withMessage("is required"),
  body("branch").trim().notEmpty().withMessage("is required"),
  body("accountNumber").trim().notEmpty().withMessage("is required").matches(/^\d+$/).withMessage("Allow numbers only"),
  body("IFSCCode").trim().notEmpty().withMessage("is required").matches(/^[A-Za-z0-9]+$/).withMessage("Don't allow special characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg)
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
  // body("_id").trim().notEmpty().withMessage("is required"),
  body("name").trim().notEmpty().withMessage("is required").isLength({ max: 75 }).withMessage('should not exceed 20 characters'),
  body("bankName").trim().notEmpty().withMessage("is required"),
  body("branch").trim().notEmpty().withMessage("is required"),
  body("accountNumber").trim().notEmpty().withMessage("is required").matches(/^\d+$/).withMessage("Allow numbers only"),
  body("IFSCCode").trim().notEmpty().withMessage("is required").matches(/^[A-Za-z0-9]+$/).withMessage("Don't allow special characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg)
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
