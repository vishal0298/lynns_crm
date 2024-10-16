const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let invoice_template = new mongoose.Schema(
  {
    default_invoice_template: {
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


module.exports = mongoose.model("invoice_template", invoice_template);
