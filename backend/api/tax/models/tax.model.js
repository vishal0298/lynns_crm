const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let account = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    taxRate: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

account.plugin(mongoosePaginate);
// Export the model
module.exports = mongoose.model("tax", account);
