const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSettingSchema = new mongoose.Schema(
  {
    isStripe: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPaypal: {
      type: Schema.Types.Boolean,
      required: true,
    },
    // isRazorpay: {
    //   type: Schema.Types.Boolean,
    //   required: true,
    // },
    paypal_account_type: {
      type: Schema.Types.String,
      required: true,
    },
    stripe_account_type: {
      type: Schema.Types.String,
      required: true,
    },
    stripepublishKey: {
      type: Schema.Types.String,
      required: false,
    },
    stripeSecretKey: {
      type: Schema.Types.String,
      required: false,
    },
    stripe_webhook_url: {
      type: Schema.Types.String,
      required: false,
    },
    paypalClientId: {
      type: Schema.Types.String,
      required: false,
    },
    paypalSecret: {
      type: Schema.Types.String,
      required: false,
    },
    paypal_webhook_url: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_paypalClientId: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_paypalSecret: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_paypal_hookurl: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_stripepublishKey: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_stripeSecretKey: {
      type: Schema.Types.String,
      required: false,
    },
    sandbox_stripe_hookurl: {
      type: Schema.Types.String,
      required: false,
    },
    // issandboxPaypal: {
    //   type: Schema.Types.Boolean,
    //   required: true,
    // },
    // issandboxStripe: {
    //   type: Schema.Types.Boolean,
    //   required: true,
    // },
    // account_type: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("paymentsettings", paymentSettingSchema);
