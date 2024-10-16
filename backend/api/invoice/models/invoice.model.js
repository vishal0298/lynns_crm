const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

let invoice = new Schema(
  {
    invoiceNumber: {
      type: Schema.Types.String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    invoiceDate: {
      type: Schema.Types.Date,
      required: true,
    },
    dueDate: {
      type: Schema.Types.Date,
      required: true,
    },
    renewalDates: {
      type: Schema.Types.Array,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
    },
    payment_method: {
      type: Schema.Types.String,
      required: true,
    },
    referenceNo: {
      type: Schema.Types.String,
      required: false,
    },
    isRecurringCancelled: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    isRecurring: {
      type: Schema.Types.Boolean,
      required: true,
    },
    recurringCycle: {
      type: Schema.Types.String,
      required: true,
    },
    items: {
      type: Schema.Types.Array,
      required: true,
    },
    // discountType: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // discount: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // tax: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    taxableAmount: {
      type: Schema.Types.String,
      required: true,
    },
    totalDiscount: {
      type: Schema.Types.String,
      required: true,
    },
    vat: {
      type: Schema.Types.String,
      required: true,
    },
    roundOff: {
      type: Schema.Types.Boolean,
      required: true,
    },
    TotalAmount: {
      type: Schema.Types.String,
      required: true,
    },
    bank: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "banksettings",
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
    termsAndCondition: {
      type: Schema.Types.String,
      required: false,
    },
    // sign_type: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // signatureId: {
    //   type: Schema.Types.ObjectId,
    //   required: false,
    //   ref: "signature",
    // },
    // signatureName: {
    //   type: Schema.Types.String,
    //   required: false,
    // },
    // signatureImage: {
    //   type: Schema.Types.String,
    //   required: false,
    //   // default: "",
    // },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    isCloned: {
      type: Schema.Types.Boolean,
      required: false,
      default: false,
    },
    isSalesReturned: {
      type: Schema.Types.Boolean,
      required: false,
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

invoice.plugin(mongoosePaginate);

invoice.virtual("customers_info", {
  ref: "customers",
  localField: "customer_id",
  foreignField: "_id",
  justOne: true,
});

invoice.set("toObject", { virtuals: true });
invoice.set("toJSON", { virtuals: true });

module.exports = mongoose.model("invoice", invoice);
