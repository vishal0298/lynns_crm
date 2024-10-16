const response = require("../../../../response");
const invoiceTemplateModel = require("../models/invoice_template.models");
const verify = require("../../../../verify.token");

exports.updateInvoiceTemplate = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;

    const filter = { userId: authUser.id };
    const update = {
      default_invoice_template: request.default_invoice_template,
      userId: authUser.id,
    };
    const options = { new: true, upsert: true };

    const invoiceTemplateRec = await invoiceTemplateModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    let data = {
      updatedData: invoiceTemplateRec,
    };
    response.success_message(data, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.viewInvoiceTemplate = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const invoiceTemplateRecord = await invoiceTemplateModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (invoiceTemplateRecord == null) {
      const obj = {
        default_invoice_template: "1",
      };
      response.success_message(obj, res);
    } else {
      response.success_message(invoiceTemplateRecord, res);
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
