const { body, validationResult } = require("express-validator");

// Validation rules for updating payment settings
exports.updatePaymentSettingValidation = [
  body("isStripe").trim().notEmpty().withMessage("is required"),
  body("isPaypal").trim().notEmpty().withMessage("is required"),

  body("stripe_account_type")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["SANDBOX", "LIVE"])
    .withMessage("is invalid"),
  body("paypal_account_type")
    .trim()
    .notEmpty()
    .withMessage("is required")
    .isIn(["SANDBOX", "LIVE"])
    .withMessage("is invalid"),

  body("stripepublishKey")
    .if(body("stripe_account_type").equals("LIVE"))
    .notEmpty()
    .withMessage("is required"),
  body("stripeSecretKey")
    .if(body("stripe_account_type").equals("LIVE"))
    .notEmpty()
    .withMessage("is required"),
  // body("stripe_webhook_url").if(body("stripe_account_type").equals("LIVE")).notEmpty().withMessage('is required'),
  body("sandbox_stripepublishKey")
    .if(body("stripe_account_type").equals("SANDBOX"))
    .notEmpty()
    .withMessage("is required"),
  body("sandbox_stripeSecretKey")
    .if(body("stripe_account_type").equals("SANDBOX"))
    .notEmpty()
    .withMessage("is required"),
  // body("sandbox_stripe_hookurl").if(body("stripe_account_type").equals("SANDBOX")).notEmpty().withMessage('is required'),

  body("paypalClientId")
    .if(body("paypal_account_type").equals("LIVE"))
    .notEmpty()
    .withMessage("is required"),
  body("paypalSecret")
    .if(body("paypal_account_type").equals("LIVE"))
    .notEmpty()
    .withMessage("is required"),
  // body("paypal_webhook_url").if(body("paypal_account_type").equals("LIVE")).notEmpty().withMessage('is required'),
  body("sandbox_paypalClientId")
    .if(body("paypal_account_type").equals("SANDBOX"))
    .notEmpty()
    .withMessage("is required"),
  body("sandbox_paypalSecret")
    .if(body("paypal_account_type").equals("SANDBOX"))
    .notEmpty()
    .withMessage("is required"),
  // body("sandbox_paypal_hookurl").if(body("paypal_account_type").equals("SANDBOX")).notEmpty().withMessage('is required'),

  // body('isStripe').optional().isBoolean().withMessage('is required'),
  // body('stripeKey').optional().isString().withMessage('stripeKey is required'),
  // body('stripeSecret').optional().isString().withMessage('stripeSecret is required'),
  // body('isPaypal').optional().isBoolean().withMessage('isPaypal must be a boolean and is required'),
  // body('paypalClientId').optional().isString().withMessage('paypalClientId is required'),
  // body('paypalSecret').optional().isString().withMessage('paypalSecret is required'),
  // body('paypalMode').optional().isString().withMessage('paypalMode is required'),
  // body('isRazorpay').optional().isBoolean().withMessage('isRazorpay must be a boolean and is required'),
  // body('razorpayKey').optional().isString().withMessage('razorpayKey must be a string'),
  // body('razorpaySecret').optional().isString().withMessage('razorpaySecret is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error_message = errors
        .array()
        .map((error) => `${error.param} ${error.msg}`);
      const data = {
        message: error_message,
      };
      return response.validation_error_message(data, res);
    }

    next();
  },
];
