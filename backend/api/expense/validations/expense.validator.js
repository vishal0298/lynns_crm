const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const expenseModel = require("../models/expense.model");

exports.create = [
  body("expenseId").trim().notEmpty().withMessage("is required"),
  body("reference")
    .trim()
    .custom((value, { req }) => {
      const regexPattern = /^[0-9]+$/;
      if (value) {
        if (regexPattern.test(value.toString())) {
          return true;
        } else {
          throw new Error("must only contain numbers");
        }
      }
      return true;
    }),
  body("amount")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[0-9]+$/)
    .withMessage("must only contain numbers"),
  body("paymentMode").trim().notEmpty().withMessage("is required"),
  body("expenseDate").trim().notEmpty().withMessage("is required"),
  body("status").trim().notEmpty().withMessage("is required"),
  body("description").optional().trim(),
  body("attachment").optional(),
  // .custom(async (value, { req }) => {
  //   if (req.body._id) {
  //     const imageRec = await expenseModel.findById(req.body._id);
  //     if ((imageRec == null || !imageRec.attachment) && !req.file) {
  //       return Promise.reject("is required");
  //     }
  //   } else {
  //     if (!req.file) {
  //       return Promise.reject("is required");
  //     }
  //   }
  //   return true;
  // }),

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

exports.update = [
  body("reference")
    .trim()
    .custom((value, { req }) => {
      const regexPattern = /^[0-9]+$/;
      if (value) {
        if (regexPattern.test(value.toString())) {
          return true;
        } else {
          throw new Error("must only contain numbers");
        }
      }
      return true;
    }),
  body("amount")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[0-9]+$/)
    .withMessage("must only contain numbers"),
  body("paymentMode").trim().notEmpty().withMessage("is required"),
  body("expenseDate").trim().notEmpty().withMessage("is required"),
  body("status").trim().notEmpty().withMessage("is required"),
  body("description").trim().optional(),
  body("attachment").trim().optional(),

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
