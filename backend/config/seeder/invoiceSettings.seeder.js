const mongoose = require("mongoose");
const invoiceSettingsModel = require("../../api/invoiceSettings/models/invoiceSettings.model");
const userModel = require("../../api/auth/models/auth.model");

exports.invoiceSettingsSeeding = async () => {
  try {
    const invoiceSettingsRecord = await invoiceSettingsModel.findOne().lean();
    if (invoiceSettingsRecord) {
      return;
    } else {
      const userRec = await userModel.findOne().lean();
      const invoiceSettingsRec = await invoiceSettingsModel.create({
        invoicePrefix: " ",
        digitalSignatureName: " ",
        invoiceLogo: " ",
        digitalSignatureImage: " ",
        userId: userRec._id,
      });
    }
  } catch (error) {
    console.log("error :", error);
  }
};
