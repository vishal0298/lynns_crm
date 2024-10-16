const { body, validationResult, query } = require("express-validator");
const response = require("../../../response");
const invoiceSettingsModel = require("../models/invoiceSettings.model");

exports.update = [
  body("invoicePrefix").trim().notEmpty().withMessage("is required"),
  body("invoiceLogo").custom(async (value, { req }) => {
    const invoiceRec = await invoiceSettingsModel.findOne();
    if ((invoiceRec == null || !invoiceRec.invoiceLogo) && !req.files) {
      return Promise.reject("is required");
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
