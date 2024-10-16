const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    invoiceId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    type: { type: mongoose.SchemaTypes.String, required: true },
    transactionDetails: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);
const transactionModel = mongoose.model("transaction", transactionSchema);
module.exports = transactionModel;
