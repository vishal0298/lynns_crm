const { body, validationResult } = require("express-validator");

exports.updatePreferenceValidation = [
  body("currencyId").notEmpty().withMessage("is required."),
  // body('language').trim().optional(),
  // body('timeZone').trim().optional(),
  // body('dateFormat').trim().optional(),
  // body('timeFormat').trim().optional(),
  // body('financialYear').trim().optional(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => `${error.param} ${error.msg}`);
      const data = {
        message: errorMessages,
      };
      response.validation_error_message(data, res, 403);
    } else {
      next();
    }
  },
];
