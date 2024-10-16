const response = require("../../../../response");
const salesReturnTemplateModel = require("../models/salesReturn_template.model");
const verify = require("../../../../verify.token");


exports.updateSalesReturnTemplate = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    
    const filter = { userId: authUser.id };
    const update = {
      default_sales_return_template: request.default_sales_return_template,
      userId: authUser.id,
    };
    const options = { new: true, upsert: true };

    const salesReturnTemplateRecord = await salesReturnTemplateModel.findOneAndUpdate(filter, update, options);

    let data = {
      updatedData: salesReturnTemplateRecord,
    };
    response.success_message(data, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.viewSalesReturnTemplate = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const salesReturnTemplateRecord = await salesReturnTemplateModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (salesReturnTemplateRecord == null) {
      const obj = {
        default_sales_return_template: "",
      };
      response.success_message(obj, res);
    }
    else{
        response.success_message(salesReturnTemplateRecord, res)
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
