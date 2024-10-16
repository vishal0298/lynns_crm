const { body, validationResult } = require("express-validator");
const response = require("../../../response");

exports.create = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("must only contain letters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("must only contain letters"),
  // body("userName").trim().notEmpty().withMessage("is required"),
  body("email").trim().notEmpty().withMessage("is required").isEmail(),
  body("mobileNumber").trim().optional(),
  // .custom((value, { req }) => {
  //   if (value) {
  //     console.log("value :", value);

  //     const regPattern = /^[0-9]+$/;
  //     if (regPattern.test(value)) {
  //       return;
  //     } else {
  //       throw new Error("must only contain numbers");
  //     }
  //   }
  // }),
  body("role").trim().notEmpty().withMessage("is required"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["Inactive", "Active"])
    .withMessage("is Invalid"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 6 })
    .withMessage("Please Enter Minimun 6 letters ")
    .custom((value, { req }) => {
      const re = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (re.test(value)) {
        return true;
      } else {
        return Promise.reject(
          "must be contain with atleast one number-upper-lower-special chars"
        );
      }
    }),

  // body("confirm_password")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("required")
  //   .isLength({ min: 6 })
  //   .withMessage("must be at least 6 chars long")
  //   .custom((value, { req }) => {
  //     if (req.body.password == value) {
  //       return true;
  //     } else {
  //       return Promise.reject("did't match with new password");
  //     }
  //   }),

  body("image")
    .optional()
    .custom((value, { req }) => {
      if (value) return Promise.reject("Must be a file type");
      var req_images_errors = [];
      var fileKeys = Object.keys(req.files);
      fileKeys.forEach(function (key) {
        if (!req.files[key])
          req_images_errors.push({
            err: `${req.files[key].filename} Must be a file`,
          });
        // console.log("req.files[key].mimetype :", req.files[key].mimetype);
        if (
          !(
            req.files[key].mimetype == "image/png" ||
            req.files[key].mimetype == "image/jpg" ||
            req.files[key].mimetype == "image/jpeg"
          )
        ) {
          req_images_errors.push({
            err: `of ${req.files[key].filename} file type must be with png or jpg `,
          });
        }
      });

      if (req_images_errors.length > 0) {
        return Promise.reject(req_images_errors[0].err);
      } else {
        return true;
      }
    }),

  async (req, res, next) => {
    console.log("req.body :", req.body);
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
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("must only contain letters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("must only contain letters"),
  body("userName").trim().optional(),
  body("email").trim().notEmpty().withMessage("is required").isEmail(),
  body("mobileNumber")
    .trim()
    .optional()
    .custom((value, { req }) => {
      if (value) {
        const regPattern = /^[0-9]+$/;
        if (regPattern.test(value)) {
          return true;
        } else {
          throw new Error("must only contain numbers");
        }
      }
      return true;
    }),
  // body("role").trim().optional(),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["Inactive", "Active"])
    .withMessage("is Invalid"),
  body("image").trim().optional(),

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

exports.del_img = [
  body("id").trim().notEmpty().withMessage("is required"),
  body("image_id").trim().notEmpty().withMessage("is required"),
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

exports.filter = [
  body("from", "to date must be greater than from date")
    .optional()
    .if((from, { req }) => {})
    .custom((value, { req }) => {
      value < req.body.to;
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
