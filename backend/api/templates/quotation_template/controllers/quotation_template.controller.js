const response = require("../../../../response");
const quotationTemplateModel = require("../models/quotation_template.model");
const verify = require("../../../../verify.token");


exports.updateQuotationTemplate = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    
    const filter = { userId: authUser.id };
    const update = {
      default_quotation_template: request.default_quotation_template,
      userId: authUser.id,
    };
    const options = { new: true, upsert: true };

    const quotationTemplateRecord = await quotationTemplateModel.findOneAndUpdate(filter, update, options);

    let data = {
      updatedData: quotationTemplateRecord,
    };
    response.success_message(data, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.viewQuotationTemplate = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const quotationTemplateRecord = await quotationTemplateModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (quotationTemplateRecord == null) {
      const obj = {
        default_quotation_template: "",
      };
      response.success_message(obj, res);
    }
    else{
        response.success_message(quotationTemplateRecord, res)
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
