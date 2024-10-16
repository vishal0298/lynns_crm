const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let products = new Schema(
  {
    type: {
      type: Schema.Types.String,
      required: true,
      enum: ["product", "service"],
    },
    name: { type: Schema.Types.String, required: true },
    sku: { type: Schema.Types.String, required: true },
    category: { type: Schema.Types.ObjectId, required: true, ref: "category" },
    sellingPrice: { type: Schema.Types.Number, min: 0, required: true },
    purchasePrice: { type: Schema.Types.Number, min : 0, required: true },
    discountValue: { type: Schema.Types.Number, required: false },
    units: { type: Schema.Types.ObjectId, required: true, ref: "unit_types" },
    discountType: { type: Schema.Types.String, required: false },
    barcode: { type: Schema.Types.String, required: false },
    alertQuantity: { type: Schema.Types.Number, min: 0, required: true },
    tax: { type: Schema.Types.ObjectId, required: false, ref: "tax" },
    productDescription: { type: Schema.Types.String, required: false },
    // images: { type: Schema.Types.Array, required: false },
    images: { type: Schema.Types.Array, required: false },
    userId: { type: Schema.Types.ObjectId, required: true },
    isDeleted: { type: Schema.Types.Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

products.plugin(mongoosePaginate);
// Export the model
module.exports = mongoose.model("products", products);
