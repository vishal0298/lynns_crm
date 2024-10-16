const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authValidator = require('../validations/auth.validator');
const checkAccess = require("../../../middleware/permission.middleware");

router.post('/login', authValidator.login,authController.login);
router.post('/signup', authValidator.signup , authController.signup); 
router.post('/forgot_password',authValidator.forgot_password ,authController.forgot_password); 
router.post('/reset_password',authValidator.reset_password ,authController.reset_password); 
router.post(
    '/change_password',
    checkAccess.checkAccess("changePassword", "update"),
    authValidator.change_password ,
    authController.change_password
);

module.exports = router;
