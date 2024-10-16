const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceSettingsSchema = new mongoose.Schema(
  {
    currencyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "currencies",
    },
    // language: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // timeZone: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // dateFormat: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // timeFormat: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // financialYear: {
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

preferenceSettingsSchema.virtual("currencyInfo", {
  ref: "currencies",
  localField: "currencyId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("preferenceSettings", preferenceSettingsSchema);
