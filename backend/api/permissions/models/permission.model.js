const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const permissionScema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    roleName: {
      type: Schema.Types.String,
      required: true,
    },
    allModules: {
      type: Schema.Types.Boolean,
      required: true,
    },
    modules: {
      type: Schema.Types.Array,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
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

module.exports = mongoose.model("permissions", permissionScema);
