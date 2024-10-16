const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;



const quotation = new Schema(
  {
    quotation_id: {
      type: Schema.Types.String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    quotation_date: {
      type: Schema.Types.Date,
      required: true,
    },
    due_date: {
      type: Schema.Types.Date,
      required: true,
    },
    reference_no: {
      type: Schema.Types.String,
      required: false,
    },
    // document_title: {
    //   type: Schema.Types.String,
    //   required: true,
    // },
    // gst: {
    //   type: Schema.Types.String,
    //   required: true,
    //   default: "Without GST",
    // },
    items: {
      type: Schema.Types.Array,
      required: true,
    },
    discountType: {
      type: Schema.Types.String,
      required: false,
    },
    status: {
      type: Schema.Types.String,
      required: false,
      default: "Open",
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
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required:true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



quotation.plugin(mongoosePaginate);


quotation.virtual("customerInfo", {
  ref: "customers",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

quotation.virtual("signatureInfo", {
  ref: "signature",
  localField: "signatureId",
  foreignField: "_id",
  justOne: true,
});

quotation.set("toObject", { virtuals: true });
quotation.set("toJSON", { virtuals: true });

// Export the model
module.exports = mongoose.model("quotation", quotation);
