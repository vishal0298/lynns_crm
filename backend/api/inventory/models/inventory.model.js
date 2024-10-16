const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const inventory = new Schema({
  // units: {
  //   type: Schema.Types.String,
  //   required: true,
  // },
  quantity: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
  },
  notes: {
    type: Schema.Types.String,
    required: false,
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
  isDeleted: {
    type: Boolean,
    required:true,
    default: false,
  },
});

inventory.plugin(mongoosePaginate);

// Export the model
module.exports = mongoose.model("inventory", inventory);
