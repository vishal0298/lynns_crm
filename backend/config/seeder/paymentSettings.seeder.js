const mongoose = require("mongoose");
const paymentSettingsModel = require("../../api/paymentSettings/models/paymnentSettings.model");
const userModel = require("../../api/auth/models/auth.model");

exports.paymentSettingsSeeding = async () => {
  try {
    const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
    if (paymentSettingsRecord) {
      return;
    } else {
      const userRec = await userModel.findOne().lean();
      const paymentSettings = await paymentSettingsModel.create({
        isStripe: true,
        isPaypal: false,
        paypal_account_type: "SANDBOX",
        stripe_account_type: "SANDBOX",
        stripepublishKey:
          "pk_test_51NQljRSBAcimcltbvDzGviJgZTeKMJ0hlHkPNkXlAU7gALzyc7RnWv4QzMiqiXp1NXd4ht5xLBnHKNdGGeIVMwyz00KDMlAUQk",
        stripeSecretKey:
          "sk_test_51NQljRSBAcimcltbXX4M91zymfOnzTvvJcDa0Cw0ZAovtPaZESzlTA0FzX4k1Vhuno5xSczK3p3CFeS5EiKr32ia00G0ARjaXZ",
        stripe_webhook_url: `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`,
        paypalClientId:
          "AZ4Ht_ZjYMfj7O_0mj0oMiNoghvlHc8AEDby4uDPqQACHAy2rvLDo_Aa68l4HZkCdMceP-JBF_OI0NeU",
        paypalSecret:
          "EEbvhB53_86jwc-mMgDRoqV3ndj4N8-dg73dbccr2caocmBA9TZfbGbSgWG4ZKK-eXtVmwGwnzm_AZXG",
        paypal_webhook_url: `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`,
        sandbox_paypalClientId:
          "AZ4Ht_ZjYMfj7O_0mj0oMiNoghvlHc8AEDby4uDPqQACHAy2rvLDo_Aa68l4HZkCdMceP-JBF_OI0NeU",
        sandbox_paypalSecret:
          "EEbvhB53_86jwc-mMgDRoqV3ndj4N8-dg73dbccr2caocmBA9TZfbGbSgWG4ZKK-eXtVmwGwnzm_AZXG",
        sandbox_paypal_hookurl: `${process.env.DEVLOPMENT_BACKEND_URL}/paypal/webhook`,
        sandbox_stripepublishKey:
          "pk_test_51NQljRSBAcimcltbvDzGviJgZTeKMJ0hlHkPNkXlAU7gALzyc7RnWv4QzMiqiXp1NXd4ht5xLBnHKNdGGeIVMwyz00KDMlAUQk",
        sandbox_stripeSecretKey:
          "sk_test_51NQljRSBAcimcltbXX4M91zymfOnzTvvJcDa0Cw0ZAovtPaZESzlTA0FzX4k1Vhuno5xSczK3p3CFeS5EiKr32ia00G0ARjaXZ",
        sandbox_stripe_hookurl: `${process.env.DEVLOPMENT_BACKEND_URL}/stripe/webhook`,
        userId: userRec._id,
      });
    }
  } catch (error) {
    console.log("error :", error);
  }
};
