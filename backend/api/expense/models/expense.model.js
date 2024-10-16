const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let expense = new Schema(
  {
    expenseId: {
      type: Schema.Types.String,
      required: true,
    },
    reference: {
      type: Schema.Types.String,
      required: false,
    },
    amount: {
      type: Schema.Types.String,
      required: true,
    },
    paymentMode: {
      type: Schema.Types.String,
      required: true,
    },
    expenseDate: {
      type: Schema.Types.Date,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
    },
    attachment: {
      type: Schema.Types.Array,
      required: false,
    },
    description:{
      type: Schema.Types.String,
      required: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
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

expense.plugin(mongoosePaginate);
expense.virtual("customers_info", {
  ref: "customers",
  localField: "contact",
  foreignField: "_id",
  justOne: true,
});

expense.set("toObject", { virtuals: true });
expense.set("toJSON", { virtuals: true });
module.exports = mongoose.model("expense", expense);
