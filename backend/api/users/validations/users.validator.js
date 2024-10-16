const { body, validationResult } = require("express-validator");
const response = require("../../../response");
const authModel = require("../../auth/models/auth.model");
const verify = require("../../../verify.token");

exports.create = [
  body("firstName").trim().notEmpty().withMessage("is required"),
  body("lastName").trim().notEmpty().withMessage("is required"),
  body("email").trim().notEmpty().withMessage("is required").isEmail(),
  body("mobileNumber").trim().optional(),
  body("gender").trim().optional(),
  body("DOB").trim().optional(),
  body("addressInformation.address").trim().optional(),
  body("addressInformation.country").trim().trim().optional(),
  body("addressInformation.state").trim().optional(),
  body("addressInformation.city").trim().optional(),
  body("addressInformation.postalcode").trim().optional(),
  body("image").optional(),
  // .custom(async(value, { req }) => {
  //   const auth_user = verify.verify_token(req.headers.token).details;
  //   if(auth_user.id){
  //     const imageRec = await authModel.findById(auth_user.id);
  //     if((imageRec == null || !imageRec.image) && !req.file){
  //       return Promise.reject('is required')
  //   }
  //   }else{
  //     if (!req.file){
  //       return Promise.reject('is required')
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
