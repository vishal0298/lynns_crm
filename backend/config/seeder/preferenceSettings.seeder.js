const preferenceSettingsModel = require("../../api/preference_settings/models/preference_settings.models");
const userModel = require("../../api/auth/models/auth.model");
const mongoose = require("mongoose");
const currency = require("../../api/currency/models/currency.model");
const currencyModel = require("../../api/currency/models/currency.model");

exports.preferenceSettingsSeeding = async () => {
  try {
    const preferenceSettingsRecord = await preferenceSettingsModel
      .findOne()
      .lean();
    if (preferenceSettingsRecord) {
      return;
    } else {
      const userRec = await userModel.findOne().lean();
      const currencyRec = await currencyModel
        .findOne({
          country_currency_short_code: "USD",
        })
        .lean();
      const preferenceSettingsRec = await preferenceSettingsModel.create({
        currencyId: currencyRec._id,
        // language: " ",
        // timeZone: " ",
        // dateFormat: " ",
        // timeFormat: " ",
        // financialYear: " ",
        userId: userRec._id,
      });
    }
  } catch (error) {
    console.log("error :", error);
  }
};
