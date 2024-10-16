const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let quotation_template = new mongoose.Schema(
  {
    default_quotation_template: {
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


module.exports = mongoose.model("quotation_template", quotation_template);
