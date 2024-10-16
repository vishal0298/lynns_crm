const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email_settings.controllers");
const emailValidator = require("../validations/email_settings.validator");
const checkAccess = require("../../../middleware/permission.middleware");

router.put(
    "/updateEmail", 
    checkAccess.checkAccess("emailSettings", "update"),
    emailValidator.updateMail, 
    emailController.updateMail
);
router.get(
    "/viewEmail", 
    checkAccess.checkAccess("emailSettings", "view"),
    emailController.viewEmailSettings
);

// router.get("/pdfCreate", emailController.pdfCreate)

module.exports = router;
