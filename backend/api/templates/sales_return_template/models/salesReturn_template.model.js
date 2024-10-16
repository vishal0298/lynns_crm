const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sales_return_template = new mongoose.Schema(
  {
    default_sales_return_template: {
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


module.exports = mongoose.model("sales_return_template", sales_return_template);
