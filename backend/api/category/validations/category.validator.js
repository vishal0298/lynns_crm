const { body, validationResult, query } = require("express-validator");
const response = require("../../../response");
const categoryModel = require("../models/category.model");

exports.create = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .custom(async (value) => {
      const existingName = await categoryModel.findOne({ name: value });
      if (existingName) {
        throw new Error("already exists");
      }
      return true;
    }),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .custom(async (value) => {
      const existingSlug = await categoryModel.findOne({ slug: value });
      if (existingSlug) {
        throw new Error("already exists");
      }
      return true;
    }),
  // body("parent_Category").trim().notEmpty().withMessage("is required"),
  body("image").optional(),
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
  body("name")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .custom(async (value, { req }) => {
      const existingName = await categoryModel.findOne({
        _id: { $ne: req.params.id },
        name: value,
      });
      if (existingName) {
        throw new Error("already exists");
      }
      return true;
    }),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .custom(async (value, { req }) => {
      const existingSlug = await categoryModel.findOne({
        _id: { $ne: req.params.id },
        slug: value,
      });
      if (existingSlug) {
        throw new Error("already exists");
      }
      return true;
    }),
  // body("parent_Category").trim().notEmpty().withMessage("is required"),
  // body("type").trim().notEmpty().withMessage("is required"),
  body("image").optional(),
  // .custom(async (value, { req }) => {
  //   const imageRec = await categoryModel.findById(req.params.id);
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
