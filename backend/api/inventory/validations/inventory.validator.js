const { body, validationResult } = require('express-validator');
const response = require('../../../response');

exports.create = [
  body('quantity')
    .trim()
    .notEmpty().withMessage('is required')
    .isInt({ min: 1 }).withMessage('must be greater than zero'),

  body('notes').trim().optional(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.param} ${error.msg}`);
      const data = {
        message: errorMessages,
      };
      response.validation_error_message(data, res, 403);
    } else {
      next();
    }
  }
];