const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  tenantName: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  url: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  dbName: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

module.exports = mongoose.model("tenant", tenantSchema);
