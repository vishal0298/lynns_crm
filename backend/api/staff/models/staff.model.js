const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let staffSchema = new Schema({
  staffName: { type: String, required: true }, // Staff Name
  employeeId: { type: String, required: true }, // Employee ID
  mobileNumber: { type: String, required: true }, // Mobile Number
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  // `created_at` and `updated_at` will be managed by Mongoose's timestamps option
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true }); // Automatically handles `created_at` and `updated_at`

staffSchema.plugin(mongoosePaginate);

// Export the model
module.exports = mongoose.model("staff", staffSchema);
