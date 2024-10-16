const mongoose = require("mongoose");
const userModel = require("../../api/auth/models/auth.model");
const notificationSettingsModel = require("../../api/notificationSettings/models/notificationSettings.model");

exports.notificationSettingsSeeding = async () => {
  try {
    const notificationSettingsRecord = await notificationSettingsModel.findOne().lean();
    if (notificationSettingsRecord) {
      return;
    } else {
      const userRec = await userModel.findOne().lean();
      const notificationSettings = await notificationSettingsModel.create({
        senderId: "FRAAtyrFTty",
        serverKey: "AAAAYwbHO68:APA91bFY21KdJpKz_EpjwQg3etCBifUvBp2IKjMog2rTFqZyFmQFEW1rFDciBftlpmepRk-bjl9CmevyFOVSAZ9o3nZ56bW_TaOknBm7xMmWmxOcqQOSWFWDn8JdsSwgyh4DITNddwXs",  
        userId: userRec._id,
      });
    }
  } catch (error) {
    console.log("error :", error);
  }
};