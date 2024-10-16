const { query, body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("name")
  .trim()
  .notEmpty().withMessage("is required")
  .matches(/^[a-zA-Z\s]+$/).withMessage("must only contain letters and spaces"),  body("taxRate").trim().notEmpty().withMessage("is required"),
  body("type").trim().notEmpty().withMessage("is required"),
  body("status").trim().notEmpty().withMessage("is required").isBoolean().withMessage("must be a boolean value"),  
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

