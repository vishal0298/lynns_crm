const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let manage_users = new Schema({

  first_name           : { type: String },
  last_name            : { type: String },
  user_name            : { type: String },
  images               : {type: Schema.Types.String,required: true,},
  email                : { type: String },
  phone_number         : { type: String },
  role                 : { type: String },
  password             : { type: String },
  confirm_password     : { type: String },
  status               : { type: String },
  user_id              : {
                            type: Schema.Types.ObjectId,
                            ref: "users",
                            required: true,
                         },
  isDeleted            : { type: Boolean, default: false },
  created_at           : { type: Date },
  updated_at           : { type: Date, default: new Date() },
});

manage_users.plugin(mongoosePaginate);

manage_users.virtual("users_info", {
  ref: "manage_users",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

manage_users.set("toObject", { virtuals: true });
manage_users.set("toJSON", { virtuals: true });

// Export the model
module.exports = mongoose.model("manage_users", manage_users);
