const response = require("../../../../response");
const purchaseOrderTemplateModel = require("../models/purchaseOrd_template.model");
const verify = require("../../../../verify.token");

exports.updatePurchaseOrderTemplate = async (req, res) => {
    try {
      const request = req.body;
      const authUser = verify.verify_token(req.headers.token).details;
      
      const filter = { userId: authUser.id };
      const update = {
        default_purchaseOrder_template: request.default_purchaseOrder_template,
        userId: authUser.id,
      };
      const options = { new: true, upsert: true };
  
      const purchaseOrderTemplateRec = await purchaseOrderTemplateModel.findOneAndUpdate(filter, update, options);
  
      let data = {
        updatedData: purchaseOrderTemplateRec,
      };
      response.success_message(data, res);
    } catch (error) {
      response.error_message(error.message, res);
    }
  };

  exports.viewPurchaseOrderTemplate = async (req, res) => {
    try {
      const authUser = verify.verify_token(req.headers.token).details;
      const purchaseOrderTemplateRecord = await purchaseOrderTemplateModel
        .findOne({
          userId: authUser.id,
        })
        .lean();
      if (purchaseOrderTemplateRecord == null) {
        const obj = {
            default_purchaseOrder_template: "",
        };
        response.success_message(obj, res);
      }
      else{
          response.success_message(purchaseOrderTemplateRecord, res)
      }
    } catch (error) {
      response.error_message(error.message, res);
    }
  };
  