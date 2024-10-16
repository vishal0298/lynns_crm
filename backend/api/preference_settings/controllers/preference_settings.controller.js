const response = require("../../../response");
const verify = require("../../../verify.token");
const preferenceSettingsModel = require("../models/preference_settings.models");

exports.updatePreference = async (req, res) => {
  try {
    const request = req.body;
    const files = req.files;
    const authUser = verify.verify_token(req.headers.token).details;
    const prefRec = await preferenceSettingsModel.findOne({
      userId: authUser.id,
    });

    if (prefRec == null) {
      const rec = await preferenceSettingsModel.create({
        currencyId: request.currencyId ? request.currencyId : " ",
        // language: request.language ? request.language : " " ,
        // timeZone: request.timeZone ? request.timeZone : " ",
        // dateFormat: request.dateFormat ? request.dateFormat : " ",
        // timeFormat: request.timeFormat ? request.timeFormat : " ",
        // financialYear: request.financialYear ? request.financialYear : " ",
        userId: authUser.id,
      });
      let data = {
        message: "preference settings updated successfully",
        updatedData: rec,
      };
      response.success_message(data, res);
    } else {
      const preferenceRec = await preferenceSettingsModel.findOneAndUpdate(
        {
          userId: authUser.id,
        },
        {
          $set: {
            currencyId: request.currencyId ? request.currencyId : " ",
            // language: request.language ? request.language : " ",
            // timeZone: request.timeZone ? request.timeZone : " ",
            // dateFormat: request.dateFormat ? request.dateFormat : " ",
            // timeFormat: request.timeFormat ? request.timeFormat : " ",
            // financialYear: request.financialYear ? request.financialYear : " ",
            userId: authUser.id,
          },
        },
        { new: true }
      );
      if (preferenceRec) {
        let data = {
          message: "preference settings updated successfully",
          updatedData: preferenceRec,
        };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.viewPreferences = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await preferenceSettingsModel
      .findOne({ userId: authUser.id })
      .populate("currencyInfo")
      .lean();

    if (preferenceRec == null) {
      const obj = {
        currencyId: "",
        language: "",
        timeZone: "",
        dateFormat: "",
        timeFormat: "",
        financialYear: "",
      };
      response.success_message(obj, res);
    } else {
      response.success_message(preferenceRec, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
