const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let purchase_orders = new Schema(
  {
    purchaseOrderId: {
      type: Schema.Types.String,
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "vendor",
    },
    purchaseOrderDate: {
      type: Schema.Types.String,
      required: true,
    },
    dueDate: {
      type: Schema.Types.String,
      required: false,
    },
    referenceNo: {
      type: Schema.Types.String,
      required: false,
    },
    items: {
      type: Schema.Types.Array,
      required: true,
    },
    // discountType: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // status: {
    //   type: Schema.Types.String,
    //   required: false,
    // },
    paymentMode: {
      type: Schema.Types.String,
      required: false,
    },
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
    sign_type: {
      type: Schema.Types.String,
      required: true,
    },
    signatureId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref:"signature"
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

purchase_orders.plugin(mongoosePaginate);

purchase_orders.virtual("customers_info", {
  ref: "customers",
  localField: "customer_id",
  foreignField: "_id",
  justOne: true,
});

purchase_orders.virtual("vendorInfo", {
  ref: "vendor",
  localField: "vendorId",
  foreignField: "_id",
  justOne: true,
});

purchase_orders.virtual("signatureInfo", {
  ref: "signature",
  localField: "signatureId",
  foreignField: "_id",
  justOne: true,
});

purchase_orders.set("toObject", { virtuals: true });
purchase_orders.set("toJSON", { virtuals: true });

module.exports = mongoose.model("purchase_orders", purchase_orders);
