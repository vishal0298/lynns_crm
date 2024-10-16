const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let purchase_template = new mongoose.Schema(
  {
    default_purchase_template: {
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


module.exports = mongoose.model("purchase_template", purchase_template);
