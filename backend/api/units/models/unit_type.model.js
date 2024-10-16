const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let unit_type = new Schema({
  id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  // parent_unit: { type: String, required: true },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  created_at: { type: Date },
  updated_at: { type: Date, default: new Date() },
  isDeleted: { type: Boolean, default: false },
});

unit_type.plugin(mongoosePaginate);
// Export the model
module.exports = mongoose.model("unit_types", unit_type);
