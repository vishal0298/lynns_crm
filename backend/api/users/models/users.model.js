const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let users = new Schema(
  {
    fullname: { type: String, required: true, max: 225 },
    password: { type: String, required: true, max: 225 },
    email: { type: String, max: 225 },
    role: { type: String, required: false},
    created_at: { type: Date },
    pswd_reset_at: { type: Date, default: null },
    requestForDelete: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
//module.exports = mongoose.model("users", users);
