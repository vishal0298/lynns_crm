const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// let customers = new Schema({
//   customer_name: { type: String },
//   primary_contact_name: { type: String },
//   customer_email: { type: String },
//   customer_phone: { type: String },
//   primary_currency: { type: String },
//   website: { type: String },
//   is_same_address: { type: Boolean, default: 0 },
//   account_number: { type: Number },
//   ifsc_code: { type: String },
//   bank_name: { type: String },
//   branch_name: { type: String },
//   address1: { type: String, max: 500 },
//   address2: { type: String, max: 500 },
//   city: { type: String },
//   state: { type: String },
//   due_amount: { type: String, default: "0.00" },
//   zip: { type: Number },
//   status: { type: String, default: "active" },
//   user_id: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   isDeleted: { type: Boolean, default: false },
//   created_at: { type: Date },
//   updated_at: { type: Date, default: new Date() },
// });
const customers = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: false,
    },
    phone: {
      type: Schema.Types.String,
      required: true,
    },
    // currency: {
    //   type: Schema.Types.String,
    //   required: false,
    // },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    membership_type: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: false,
    },
    notes: {
      type: Schema.Types.String,
      required: false,
    },
    status: {
      type: Schema.Types.String,
      required: true,
      default: "Active",
    },
    // billingAddress: {
    //   name: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   addressLine1: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   addressLine2: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   city: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   state: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   pincode: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   country: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    // },
    // shippingAddress: {
    //   name: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   addressLine1: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   addressLine2: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   city: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   state: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   pincode: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    //   country: {
    //     type: Schema.Types.String,
    //     required: false,
    //   },
    // },
    bankDetails: {
      bankName: {
        type: Schema.Types.String,
        required: false,
      },
      branch: {
        type: Schema.Types.String,
        required: false,
      },
      accountHolderName: {
        type: Schema.Types.String,
        required: false,
      },
      accountNumber: {
        type: Schema.Types.String,
        required: false,
      },
      IFSC: {
        type: Schema.Types.String,
        required: false,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
customers.plugin(mongoosePaginate);
// Export the model
module.exports = mongoose.model("customers", customers);
