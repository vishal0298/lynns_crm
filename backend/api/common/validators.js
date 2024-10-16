const { body, validationResult } = require("express-validator");
const response = require("../../response");

exports._idValidator = [
  body("_id").trim().notEmpty().withMessage("is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var error_message = "";
      errors.array().forEach(function (errorsList) {
        error_message += errorsList.param + " " + errorsList.msg + ", ";
      });
      error_message = error_message.replace(/,\s*$/, "");
      data = {
        message: error_message,
      };
      response.validation_error_message(data, res);
    } else {
      next();
    }
  },
];
