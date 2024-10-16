const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ledger = new Schema({
  referenceId: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
  },
  name: {
    type: Schema.Types.String,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  reference: {
    type: Schema.Types.String,
    required: false,
  },
  mode: {
    type: Schema.Types.String,
    required: true,
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "vendors",
    required: true,
  },

  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

ledger.plugin(mongoosePaginate);

module.exports = mongoose.model("ledger", ledger);
