const { body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("vendor_name").trim().notEmpty().withMessage("is required"),
  body("vendor_email").trim().notEmpty().withMessage("is required").isEmail(),
  body("vendor_phone").trim().notEmpty().withMessage("is required").isInt(),
  body("balance")
    .trim()
    .optional()
    .isFloat({ min: 0 })
    .withMessage("should be greater than or equal 0"),
  body("balanceType")
    .trim()
    .custom((value, { req }) => {
      if (req.body.balance && req.body.balance !== "0") {
        if (!value) {
          throw Error(`is required`);
        }
        return true;
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
