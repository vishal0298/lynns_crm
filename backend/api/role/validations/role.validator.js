const { body,validationResult,query } = require('express-validator');
const response = require('../../../response');

exports.create = [
  body("roleName").trim().notEmpty().withMessage('is required'),

  async (req, res,next) =>
  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
      var error_message = [];
      errors.array().forEach(function (errorsList) {
        error_message.push(errorsList.param + " " + errorsList.msg)
      });
      data = {
        message: error_message,
      };
      response.validation_error_message(data, res);

    }else{
      next();
    }
  }];