const { body,validationResult } = require('express-validator');
const response = require('../../../response');

exports.updateMail = [
  body("provider_type")
    .trim()
    .notEmpty()
    .withMessage('is required')
    .isIn(["SMTP", "NODE"])
    .withMessage("is invalid"),

  body("smtpFromName").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("smtpFromEmail").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("smtpHost").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("smtpPort").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("smtpUsername").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("smtpPassword").if(body("provider_type").equals("SMTP")).notEmpty().withMessage('is required'),

  body("nodeFromName").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  body("nodeFromEmail").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  body("nodeHost").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  body("nodePort").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  body("nodeUsername").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  body("nodePassword").if(body("provider_type").equals("NODE")).notEmpty().withMessage('is required'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error_message = errors.array().map(error => `${error.param} ${error.msg}`);
      const data = {
        message: error_message,
      };
      return response.validation_error_message(data, res);
    }

    next();
  }
];
