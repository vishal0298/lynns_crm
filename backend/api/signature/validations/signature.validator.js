const { body, validationResult } = require('express-validator');
const response = require('../../../response');
const signatureModel = require("../models/signature.model");


exports.create = [

    body("signatureName").trim().notEmpty().withMessage("is required"),
    body("status").trim().notEmpty().withMessage("is required"),
    body("markAsDefault").trim().optional(),
    body("signatureImage").custom(async (value, { req }) => {
        if (req.body._id) {
            const imageRec = await signatureModel.findById(req.body._id);
            if ((imageRec == null || !imageRec.signatureImage) && !req.file) {
                return Promise.reject('is required')
            }
        } else {
            if (!req.file) {
                return Promise.reject('is required')
            }
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