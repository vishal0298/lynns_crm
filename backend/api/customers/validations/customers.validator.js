const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const customersModel = require("../models/customers.model");

exports.create = [
  body("name").trim().notEmpty().withMessage("is required"),
  // body("email").custom(async (value) => {
  //   const existingUser = await customersModel.findOne({ email: value });
  //   if (existingUser) {
  //     throw new Error("Email already exists");
  //   }
  //   return true;
  // }),
  body("phone").trim().notEmpty().withMessage("is required"),
  // body("currency").trim().trim().optional(),
  body("website").trim().trim().optional(),
  body("notes").trim().optional(),
  body("status").trim().optional(),

  body("billingAddress.name").trim().optional(),
  body("billingAddress.addressLine1")
  .trim().optional(),
  body("billingAddress.addressLine2").trim().optional(),
  body("billingAddress.city").trim().optional(),
  body("billingAddress.state").trim().optional(),
  body("billingAddress.pincode").trim().trim().optional(),
  body("billingAddress.country").trim().trim().optional(),

  body("shippingAddress.name").trim().optional(),
  body("shippingAddress.addressLine1")
  .trim().optional(),
  body("shippingAddress.addressLine2").trim().optional(),
  body("shippingAddress.city").trim().optional(),
  body("shippingAddress.state").trim().optional(),
  body("shippingAddress.pincode").trim().optional(),
  body("shippingAddress.country").trim().optional(),

  body("bankDetails.bankName").trim().optional(),
  body("bankDetails.branch").trim().optional(),
  body("bankDetails.accountHolderName").trim().optional(),
  body("bankDetails.accountNumber").trim().optional(),
  body("bankDetails.IFSC").trim().optional(),
  body("image")
  .optional(),
  // .custom((value, { req }) => {
  //   if (!req.file) {
  //     return Promise.reject("is required");
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
  body("name").trim().notEmpty().withMessage("is required"),
  // body("email").trim().notEmpty().withMessage("is required"),
  body("phone").trim().notEmpty().withMessage("is required"),
  // body("currency").trim().optional(),
  body("website").trim().optional(),
  body("notes").trim().optional(),
  body("status").trim().optional(),

  body("billingAddress.name").trim().optional(),
  body("billingAddress.addressLine1")
  .trim().optional(),
  body("billingAddress.addressLine2").trim().optional(),
  body("billingAddress.city").trim().optional(),
  body("billingAddress.state").trim().optional(),
  body("billingAddress.pincode").trim().optional(),
  body("billingAddress.country").trim().optional(),

  body("shippingAddress.name").trim().optional(),
  body("shippingAddress.addressLine1")
  .trim().optional(),
  body("shippingAddress.addressLine2").trim().optional(),
  body("shippingAddress.city").trim().optional(),
  body("shippingAddress.state").trim().optional(),
  body("shippingAddress.pincode").trim().optional(),
  body("shippingAddress.country").trim().optional(),

  body("bankDetails.bankName").trim().optional(),
  body("bankDetails.branch").trim().optional(),
  body("bankDetails.accountHolderName").trim().optional(),
  body("bankDetails.accountNumber").trim().optional(),
  body("bankDetails.IFSC").trim().optional(),
  body("image")
  .optional(),
  // .custom(async (value, { req }) => {
  //   const imageRec = await customersModel.findById(req.params.id);
  //   if ((imageRec == null || !imageRec.image) && !req.file) {
  //     return Promise.reject("is required");
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
