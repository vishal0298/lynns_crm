const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let category = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  //parent_Category: { type: String, required: false },
  image: { type: String, required: false, default: "" },
  // type: { type: String, required: true},
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  created_at: { type: Date },
  updated_at: { type: Date, default: new Date() },
  isDeleted: { type: Boolean, default: false },
});

category.plugin(mongoosePaginate);
// Export the model
module.exports = mongoose.model("category", category);
