const response = require("../../../response");
const verify = require("../../../verify.token");
const paymentSettingsModel = require("../models/paymnentSettings.model");

exports.updatePaymentSetting = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;

    const query = {},
    update = {
      isStripe: request.isStripe,
      isPaypal: request.isPaypal,
      // isRazorpay: request.isRazorpay || false,
      paypal_account_type: request.paypal_account_type,
      stripe_account_type: request.stripe_account_type,
      stripepublishKey: request.stripepublishKey,
      stripeSecretKey: request.stripeSecretKey,
      stripe_webhook_url: request.stripe_webhook_url,
      paypalClientId: request.paypalClientId,
      paypalSecret: request.paypalSecret,
      paypal_webhook_url: request.paypal_webhook_url,
      sandbox_paypalClientId: request.sandbox_paypalClientId,
      sandbox_paypalSecret: request.sandbox_paypalSecret,
      sandbox_paypal_hookurl: request.sandbox_paypal_hookurl,
      sandbox_stripepublishKey: request.sandbox_stripepublishKey,
      sandbox_stripeSecretKey: request.sandbox_stripeSecretKey,
      sandbox_stripe_hookurl: request.sandbox_stripe_hookurl,
      userId: authUser.id,
      // issandboxPaypal: request.issandboxPaypal || false,
      // issandboxStripe: request.issandboxStripe || false,
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const paymentRec=await paymentSettingsModel.findOneAndUpdate(query, update, options);
   
      let data = {
        message: "Payment settings updated successfully",
        updatedData: paymentRec,
      };
      response.success_message(data, res);

  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.viewPaymentSetting = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await paymentSettingsModel
      .findOne({})
      .lean();

    if (preferenceRec == null) {
      const obj = {
        isStripe: false,
        isPaypal: false,
        paypal_account_type: "",
        stripe_account_type: "",
        stripepublishKey: "",
        stripeSecretKey: "",
        stripe_webhook_url: `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`,
        paypalClientId: "",
        paypalSecret: "",
        paypal_webhook_url: `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`,
        sandbox_paypalClientId: "",
        sandbox_paypalSecret: "",
        sandbox_paypal_hookurl: `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`,
        sandbox_stripepublishKey: "",
        sandbox_stripeSecretKey: "",
        sandbox_stripe_hookurl: `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`,
      };

      response.success_message(obj, res);
    } else {
      preferenceRec.sandbox_paypal_hookurl = `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`;

      preferenceRec.paypal_webhook_url = `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`;

      preferenceRec.sandbox_stripe_hookurl = `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`;

      preferenceRec.stripe_webhook_url = `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`;

      response.success_message(preferenceRec, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
