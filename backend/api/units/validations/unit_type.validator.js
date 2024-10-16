const { body, validationResult, query } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Accept letters only"),
  body("symbol")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Accept letters & numbers only"),
  // body("parent_unit").trim().notEmpty().withMessage('is required').matches(/^[a-zA-Z\s]+$/).withMessage("Accept letters only"),

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
