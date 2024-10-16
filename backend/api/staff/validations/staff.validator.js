const { body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Accept letters only"),

  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Accept letters & numbers only"),

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Accept valid 10-digit numbers only"),

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
