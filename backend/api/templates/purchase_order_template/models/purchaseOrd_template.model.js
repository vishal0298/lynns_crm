const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let purchaseOrder_template = new mongoose.Schema(
  {
    default_purchaseOrder_template: {
        type: Schema.Types.String,
        required: true
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


module.exports = mongoose.model("purchaseOrder_template", purchaseOrder_template);
