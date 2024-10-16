const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let delivery_challans = new Schema(
  {
    deliveryChallanNumber: {
      type: Schema.Types.String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    deliveryChallanDate: {
      type: Schema.Types.Date,
      required: true,
    },
    dueDate: {
      type: Schema.Types.Date,
      required: false,
    },
    referenceNo: {
      type: Schema.Types.String,
      required: false,
    },
    deliveryAddress: {
      name: {
        type: Schema.Types.String,
        required: true,
      },
      addressLine1: {
        type: Schema.Types.String,
        required: true,
      },
      addressLine2: {
        type: Schema.Types.String,
        required: false,
      },
      city: {
        type: Schema.Types.String,
        required: true,
      },
      state: {
        type: Schema.Types.String,
        required: true,
      },
      pincode: {
        type: Schema.Types.String,
        required: true,
      },
      country: {
        type: Schema.Types.String,
        required: true,
      },
    },
    items: {
      type: Schema.Types.Array,
      required: true,
    },
    discountType: {
      type: Schema.Types.String,
      required: false,
    },
    discount: {
      type: Schema.Types.String,
      required: false,
    },
    tax: {
      type: Schema.Types.String,
      required: false,
    },
    taxableAmount: {
      type: Schema.Types.String,
      required: false,
    },
    totalDiscount: {
      type: Schema.Types.String,
      required: false,
    },
    vat: {
      type: Schema.Types.String,
      required: false,
    },
    roundOff: {
      type: Schema.Types.Boolean,
      required: false,
    },
    TotalAmount: {
      type: Schema.Types.String,
      required: false,
    },
    bank: {
      type: Schema.Types.String,
      required: false,
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
    termsAndCondition: {
      type: Schema.Types.String,
      required: false,
    },
    sign_type: {
      type: Schema.Types.String,
      required: true,
    },
    signatureId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "signature",
    },
    signatureName: {
      type: Schema.Types.String,
      required: false,
    },
    signatureImage: {
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

delivery_challans.plugin(mongoosePaginate);

delivery_challans.virtual("customers_info", {
  ref: "customers",
  localField: "customer_id",
  foreignField: "_id",
  justOne: true,
});

delivery_challans.virtual("signatureInfo", {
  ref: "signature",
  localField: "signatureId",
  foreignField: "_id",
  justOne: true,
});

delivery_challans.set("toObject", { virtuals: true });
delivery_challans.set("toJSON", { virtuals: true });
module.exports = mongoose.model("delivery_challans", delivery_challans);
