const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const payment = new Schema(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "invoices",
    },
    invoiceAmount: {
      type: Schema.Types.Number,
      required: true,
    },
    received_on: {
      type: Schema.Types.String,
      required: false,
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Upi", "Card", "Membership"],
    },
    amount: {
      type: Schema.Types.Number,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
    status: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

payment.plugin(mongoosePaginate);

// Export the model
module.exports = mongoose.model("payment", payment);
