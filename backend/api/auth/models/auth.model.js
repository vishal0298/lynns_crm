const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const server = require("../../../server");

let users = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    lastName: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    userName: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    fullname: { type: String, required: false, default: "", max: 225 },
    email: { type: Schema.Types.String, required: true, max: 225 },
    fcmToken: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    role: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    status: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    mobileNumber: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    gender: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    DOB: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    image: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    addressInformation: {
      address: {
        type: Schema.Types.String,
        required: false,
        default: "",
      },
      country: {
        type: Schema.Types.String,
        required: false,
        default: "",
      },
      state: {
        type: Schema.Types.String,
        required: false,
        default: "",
      },
      city: {
        type: Schema.Types.String,
        required: false,
        default: "",
      },
      postalcode: {
        type: Schema.Types.String,
        required: false,
        default: "",
      },
    },
    password: { type: String, required: true, max: 225 },
    pswd_reset_at: { type: Date, default: "" },
    requestForDelete: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    deleteRequestDate: {
      type: Schema.Types.Date,
      required: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
//server.tenantDB.model("users", users);
module.exports = mongoose.model("users", users);
