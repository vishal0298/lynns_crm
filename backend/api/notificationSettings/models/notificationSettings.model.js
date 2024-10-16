const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let notificationSettingsSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.String,
      required: true,
    },
    serverKey: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("notificationSettings", notificationSettingsSchema);
