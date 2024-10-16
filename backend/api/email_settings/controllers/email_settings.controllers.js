const response = require("../../../response");
const verify = require("../../../verify.token");
const emailSettingModel = require("../models/email_settings.model");

exports.updateMail = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const emailSettingRec = await emailSettingModel.findOne({
      userId: authUser.id,
    });

    if (emailSettingRec == null) {
      const rec = await emailSettingModel.create({
        provider_type: request.provider_type ? request.provider_type : "",
        nodeFromName: request.nodeFromName ? request.nodeFromName : "",
        nodeFromEmail: request.nodeFromEmail ? request.nodeFromEmail : "",
        nodeHost: request.nodeHost ? request.nodeHost : "",
        nodePort: request.nodePort ? request.nodePort : "",
        nodeUsername: request.nodeUsername ? request.nodeUsername : "",
        nodePassword: request.nodePassword ? request.nodePassword : "",
        smtpFromName: request.smtpFromName ? request.smtpFromName : "",
        smtpFromEmail: request.smtpFromEmail ? request.smtpFromEmail : "",
        smtpHost: request.smtpHost ? request.smtpHost : "",
        smtpPort: request.smtpPort ? request.smtpPort : "",
        smtpUsername: request.smtpUsername ? request.smtpUsername : "",
        smtpPassword: request.smtpPassword ? request.smtpPassword : "",
        userId: authUser.id,
      });
      let data = {
        message: "Email settings updated successfully",
        updatedData: rec,
      };
      response.success_message(data, res);
    } else {
      const preferenceRec = await emailSettingModel.findOneAndUpdate(
        {
          userId: authUser.id,
        },
        {
          $set: {
            provider_type: request.provider_type ? request.provider_type : "",
            nodeFromName: request.nodeFromName ? request.nodeFromName : "",
            nodeFromEmail: request.nodeFromEmail ? request.nodeFromEmail : "",
            nodeHost: request.nodeHost ? request.nodeHost : "",
            nodePort: request.nodePort ? request.nodePort : "",
            nodeUsername: request.nodeUsername ? request.nodeUsername : "",
            nodePassword: request.nodePassword ? request.nodePassword : "",
            smtpFromName: request.smtpFromName ? request.smtpFromName : "",
            smtpFromEmail: request.smtpFromEmail ? request.smtpFromEmail : "",
            smtpHost: request.smtpHost ? request.smtpHost : "",
            smtpPort: request.smtpPort ? request.smtpPort : "",
            smtpUsername: request.smtpUsername ? request.smtpUsername : "",
            smtpPassword: request.smtpPassword ? request.smtpPassword : "",
            userId: authUser.id,
          },
        },
        { new: true }
      );
      if (preferenceRec) {
        let data = {
          message: "Email settings updated successfully",
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

exports.viewEmailSettings = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await emailSettingModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (preferenceRec == null) {
      const obj = {
        provider_type: "",
        nodeFromName: "",
        nodeFromEmail: "",
        nodeHost: "",
        nodePort: "",
        nodeUsername: "",
        nodePassword: "",
        smtpFromName: "",
        smtpFromEmail: "",
        smtpHost: "",
        smtpPort: "",
        smtpUsername: "",
        smtpPassword: "",
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
