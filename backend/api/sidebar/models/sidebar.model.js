const mongoose = required('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

let sidebar = new Schema({
    dashboard : {type: Schema.Types.Mixed, required: false},
    customers : {type: Schema.Types.Mixed, required: false},
    vendors : {type: Schema.Types.Mixed, required: false},
    productAndServices : {type: Schema.Types.Mixed, required: false},
    inventory : {type: Schema.Types.Mixed, required: false},
    invoices : {type: Schema.Types.Mixed, required: false},
    creditNotes : {type: Schema.Types.Mixed, required: false},
    purchases : {type: Schema.Types.Mixed, required: false},
    debitNotes : {type: Schema.Types.Mixed, required: false},
    quotations : {type: Schema.Types.Mixed, required: false},
    paymentSummary : {type: Schema.Types.Mixed, required: false},
    manageUsers : {type: Schema.Types.Mixed, required: false},
    rolesAndPermission : {type: Schema.Types.Mixed, required: false},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      
      created_at: { type: Date },
      updated_at: { type: Date, default: new Date() },
      isDeleted: { type: Boolean, default: false },
})


module.exports = mongoose.model("sidebar", sidebar);
