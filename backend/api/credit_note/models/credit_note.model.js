const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const credit_note = new Schema(
  {
    credit_note_id: {
      type: Schema.Types.String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    credit_note_date: {
      type: Schema.Types.String,
      required: true,
    },
    due_date: {
      type: Schema.Types.String,
      required: true,
    },
    reference_no: {
      type: Schema.Types.String,
      required: false,
    },
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
      required: true,
    },
    paymentMode: {
      type: Schema.Types.String,
      required: true,
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

credit_note.plugin(mongoosePaginate);


credit_note.virtual("customerInfo", {
  ref: "customers",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

credit_note.virtual("signatureInfo", {
  ref: "signature",
  localField: "signatureId",
  foreignField: "_id",
  justOne: true,
});

credit_note.set("toObject", { virtuals: true });
credit_note.set("toJSON", { virtuals: true });


module.exports = mongoose.model("credit_note", credit_note);
