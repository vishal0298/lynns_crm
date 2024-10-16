const response = require("../../../../response");
const purchaseReturnTemplateModel = require("../models/purchaseReturn_template.model");
const verify = require("../../../../verify.token");


exports.updatePurchaseReturnTemplate = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    
    const filter = { userId: authUser.id };
    const update = {
        default_purchase_return_template: request.default_purchase_return_template,
      userId: authUser.id,
    };
    const options = { new: true, upsert: true };

    const purchaseReturnTemplateRecord = await purchaseReturnTemplateModel.findOneAndUpdate(filter, update, options);

    let data = {
      updatedData: purchaseReturnTemplateRecord,
    };
    response.success_message(data, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.viewPurchaseReturnTemplate = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const purchaseReturnTemplateRecord = await purchaseReturnTemplateModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (purchaseReturnTemplateRecord == null) {
      const obj = {
        default_purchase_return_template: "",
      };
      response.success_message(obj, res);
    }
    else{
        response.success_message(purchaseReturnTemplateRecord, res)
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
