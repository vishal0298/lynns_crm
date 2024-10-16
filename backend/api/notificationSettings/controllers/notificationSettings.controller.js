const response = require("../../../response");
const verify = require("../../../verify.token");
const notificationSettingsModel = require("../../notificationSettings/models/notificationSettings.model")


exports.updateNotificationSettings = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const notificationSettingsRec = await notificationSettingsModel.findOne({
      userId: authUser.id,
    });

    if (notificationSettingsRec == null) {
      const rec = await notificationSettingsModel.create({
        senderId: request.senderId,
        serverKey: request.serverKey,
        userId: authUser.id,
      });
      let data = {
        message: "notification settings updated successfully",
        updatedData: rec,
      };
      response.success_message(data, res);
    } else {
      const preferenceRec = await notificationSettingsModel.findOneAndUpdate(
        {
          userId: authUser.id,
        },
        {
          $set: {
            senderId: request.senderId,
            serverKey: request.serverKey,
            userId: authUser.id,
          },
        },
        { new: true }
      );
      if (preferenceRec) {
        let data = {
          message: "notification settings updated successfully",
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


exports.viewNotificationSettings = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await notificationSettingsModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (preferenceRec == null) {
      const obj = {
        senderId: "",
        serverKey: "",
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
