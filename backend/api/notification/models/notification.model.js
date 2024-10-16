const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    body: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    mark:{
      type: mongoose.SchemaTypes.String,
      required: true,
      default:true
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", notificationSchema);
