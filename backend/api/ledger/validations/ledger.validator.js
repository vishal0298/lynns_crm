const { body, validationResult, query } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("name").trim().notEmpty().withMessage("is required"),
  body("date").trim().notEmpty().withMessage("is required"),
  body("reference").trim().optional(),
  body("mode").trim().notEmpty().withMessage("is required"),
  // body("vendor_Id").trim().notEmpty().withMessage('is required'),

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

exports.list = [
  //query("category").trim().notEmpty().withMessage('is required').isIn(['PRODUCT', 'SERVICES']).withMessage('is Must be a `PRODUCT` OR `SERVICES`'),
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
