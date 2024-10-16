const response = require("../../../response");
const verify = require("../../../verify.token");
const invoiceSettingsModel = require("../models/invoiceSettings.model");
const path = require("path");
const fs = require("fs");

exports.updateInvoiceSetting = async (req, res) => {
  try {
    const request = req.body;
    const files = req.files;
    const authUser = verify.verify_token(req.headers.token).details;
    const invoiceSettingsRec = await invoiceSettingsModel.findOne({
      userId: authUser.id,
    });
    let invoiceLogoPath = "";

    if (invoiceSettingsRec == null) {
      if (files.invoiceLogo) {
        invoiceLogoPath = files.invoiceLogo[0].path;
      }
      const rec = await invoiceSettingsModel.create({
        invoicePrefix: request.invoicePrefix,
        invoiceLogo: invoiceLogoPath,
        userId: authUser.id,
      });
      let data = {
        message: "invoice settings updated successfully",
        updatedData: rec,
      };
      response.success_message(data, res);
    } else {
      invoiceLogoPath = invoiceSettingsRec.invoiceLogo;
      if (files.invoiceLogo) {
        invoiceLogoPath = files.invoiceLogo[0].path;
        if (
          invoiceSettingsRec.invoiceLogo !== "" &&
          fs.existsSync(invoiceSettingsRec.invoiceLogo)
        ) {
          const rootDir = path.resolve("./");
          let oldImagePath = path.join(rootDir, invoiceSettingsRec.invoiceLogo);
          fs.unlinkSync(oldImagePath);
        }
      }

      const preferenceRec = await invoiceSettingsModel.findOneAndUpdate(
        {
          userId: authUser.id,
        },
        {
          $set: {
            invoicePrefix: request.invoicePrefix,
            invoiceLogo: invoiceLogoPath,
            userId: authUser.id,
          },
        },
        { new: true }
      );
      if (preferenceRec) {
        if (preferenceRec.invoiceLogo && preferenceRec.invoiceLogo !== " ") {
          preferenceRec.invoiceLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.invoiceLogo}`;
        }
        let data = {
          message: "invoice settings updated successfully",
          updatedData: preferenceRec,
        };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.viewInvoiceSetting = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const preferenceRec = await invoiceSettingsModel
      .findOne({
        userId: authUser.id,
      })
      .lean();
    if (preferenceRec == null) {
      const obj = {
        invoicePrefix: "",
        invoiceLogo: "",
      };
      response.success_message(obj, res);
    } else {
      if (preferenceRec.invoiceLogo && preferenceRec.invoiceLogo !== " ") {
        preferenceRec.invoiceLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${preferenceRec.invoiceLogo}`;
      }
      response.success_message(preferenceRec, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
