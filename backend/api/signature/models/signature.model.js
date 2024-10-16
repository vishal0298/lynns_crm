const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;


const signature = new Schema(
    {
        signatureName: {
            type: Schema.Types.String,
            required: true,
        },
        signatureImage: {
            type: Schema.Types.String,
            required: true,
        },
        status: {
            type: Schema.Types.Boolean,
            required: true,
        },
        markAsDefault: {
            type: Schema.Types.Boolean,
            required: false,
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

signature.plugin(mongoosePaginate);

module.exports = mongoose.model("signature", signature);
