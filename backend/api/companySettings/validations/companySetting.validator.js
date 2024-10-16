const { body, validationResult, query } = require("express-validator");
const response = require("../../../response");
const companySettingsModel = require("../models/companySetting.model");

exports.update = [
  body("companyName").trim().notEmpty().withMessage("is required"),
  body("email").trim().notEmpty().withMessage("is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isLength({ min: 10 })
    .withMessage("number should have atleast 10 Numeric"),
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isLength({ max: 30 })
    .withMessage("should not exceed 30 characters"),
  body("addressLine2")
    .trim()
    .optional()
    .isLength({ max: 30 })
    .withMessage("should not exceed 30 characters"),
  body("city").trim().notEmpty().withMessage("is required"),
  body("state").trim().notEmpty().withMessage("is required"),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^\d+$/)
    .withMessage("should contain only numbers"),
  body("siteLogo").custom(async (value, { req }) => {
    const companyeRec = await companySettingsModel.findOne();
    if ((companyeRec == null || !companyeRec.image) && !req.files) {
      return Promise.reject("is required");
    }
    return true;
  }),
  body("companyLogo").custom(async (value, { req }) => {
    const companyeRec = await companySettingsModel.findOne();
    if ((companyeRec == null || !companyeRec.companyLogo) && !req.files) {
      return Promise.reject("is required");
    }
    return true;
  }),
  body("favicon").custom(async (value, { req }) => {
    const companyeRec = await companySettingsModel.findOne();
    if ((companyeRec == null || !companyeRec.favicon) && !req.files) {
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
