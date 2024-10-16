const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolesAndPermissionsSchema = new mongoose.Schema(
  {
    roleName: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

    userId: {
      type: mongoose.SchemaTypes.ObjectId,
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

const rolesAndpermissionsModel = mongoose.model(
  "roles",
  rolesAndPermissionsSchema
);

module.exports = rolesAndpermissionsModel;
