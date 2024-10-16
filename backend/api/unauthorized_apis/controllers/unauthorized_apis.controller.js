const response = require("../../../response");
const companySettingModel = require("../../companySettings/models/companySetting.model");
const emailSettingModel = require("../../email_settings/models/email_settings.model");
const invoiceModel = require("../../invoice/models/invoice.model");
const { createTransporters } = require("../../common/mailSend");
const fs = require("fs");
const handlebars = require("handlebars");
const preference_settingsModels = require("../../preference_settings/models/preference_settings.models");
const paymentsModel = require("../../payment/models/payment.model");
const mongoose = require("mongoose");
const moment = require("moment/moment");
const path = require("path");
const cryptojs = require("crypto-js");
const paymentSettingsModel = require("../../paymentSettings/models/paymnentSettings.model");

exports.companyImages = async (req, res) => {
  try {
    const companySettingsRecord = await companySettingModel.findOne().lean();
    if (companySettingsRecord) {
      if (companySettingsRecord.siteLogo !== "") {
        companySettingsRecord.siteLogo = `${process.env.DEVLOPMENT_BACKEND_URL}/${companySettingsRecord.siteLogo}`;
      }
      if (companySettingsRecord.favicon !== "") {
        companySettingsRecord.favicon = `${process.env.DEVLOPMENT_BACKEND_URL}/${companySettingsRecord.favicon}`;
      }

      response.success_message(companySettingsRecord, res);
    } else {
      const companyResponse = {
        siteLogo: " ",
        favicon: " ",
      };
      response.success_message(companyResponse, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.sentPaymentLinks = async (req, res) => {
  try {
    const invoiceRecord = await invoiceModel
      .findById(req.query.invoiceId)
      .populate("customerId")
      .lean();

    const enc_data = cryptojs.AES.encrypt(
      JSON.stringify(req.query.invoiceId),
      "secret_key"
    ).toString();
    const paymentURL =
      process.env.DEVLOPMENT_FRONTEND_URL +
      "/" +
      "online-payment?key=" +
      enc_data;

    const data = {
      name: invoiceRecord.customerId.name,
      url: paymentURL,
      dueDate: moment(invoiceRecord.dueDate, "DD/MM/YYYY").format(
        "DD MMM YYYY"
      ),
    };
    const subject = "Payment link";

    const htmlTemplate = fs.readFileSync("./receipt-new.html", "utf-8");
    const handlebarTemplate = handlebars.compile(htmlTemplate)(data);
    const emailRecord = await emailSettingModel.findOne().lean();
    
    if(emailRecord!=null){
      const transporters = await createTransporters();
      const nodeTransporter = transporters.nodeTransporter;
      const smtpTransporter = transporters.smtpTransporter;
      const rootDirName = __dirname.split("api")[0];
      const absolutePath = path.join(rootDirName, "/assets/img/logo.png");
      
    
    if (emailRecord.provider_type == "NODE") {
      nodeTransporter.sendMail(
        {
          from: `${emailRecord.nodeFromName} <${emailRecord.nodeFromEmail}>`,
          to: invoiceRecord.customerId.email,
          subject: subject,
          attachments: [
            {
              filename: "logo.png",
              path: absolutePath,
              cid: "logo",
            },
          ],
          html: handlebarTemplate,
        },
        async (err, mailResponse) => {
          if (err) {
            console.log("err :", err);
            if (req.query.value == "invoiceController") {
              return;
            } else {
              response.validation_error_message({message:'Failed to send!'}, res);
            }
          } else {
            await invoiceModel.findByIdAndUpdate(req.query.invoiceId, {
              $set: {
                status: "SENT",
              },
            });
            if (req.query.value == "invoiceController") {
              return;
            } else {
              response.success_message(
                { message: "Mail sent successfully!" },
                res
              );
            }
          }
        }
      );
    } else {
      smtpTransporter.sendMail(
        {
          from: `${emailRecord.smtpFromName} <${emailRecord.smtpFromEmail}>`,
          to: invoiceRecord.customerId.email,
          subject: subject,
          attachments: [
            {
              filename: "logo.png",
              path: absolutePath,
              cid: "logo",
            },
          ],
          html: handlebarTemplate,
        },
        async (err, mailResponse) => {
          if (err) {
            console.log("err :", err);
            if (req.query.value == "invoiceController") {
              return;
            } else {
              response.validation_error_message({message:'Failed to send!'}, res);
            }
          } else {
            await invoiceModel.findByIdAndUpdate(req.query.invoiceId, {
              $set: {
                status: "SENT",
              },
            });
            if (req.query.value == "invoiceController") {
              return;
            } else {
              response.success_message(
                { message: "Mail sent successfully!" },
                res
              );
            }
          }
        }
      );
    }
  }else{
    const errorMsg = { message: "From email is empty!" };
    response.validation_error_message(errorMsg, res);
  }


  } catch (error) {
    console.log("error :", error);
    response.error_message(error, res);
  }
};

exports.viewInvoice = async (req, res) => {
  try {
    const companySettingsRecord = await companySettingModel.findOne().lean();
    const preferenceSettings = await preference_settingsModels
      .findOne()
      .populate("currencyId")
      .lean();

    const invoiceRecord = await invoiceModel
      .findById(req.query.invoiceId)
      .populate("customerId")
      .lean();
    const paymentsReocrd = await paymentsModel.aggregate([
      {
        $match: {
          invoiceId: mongoose.Types.ObjectId(req.query.invoiceId),
        },
      },
      {
        $group: {
          _id: null,
          paidAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    let balance = parseFloat(invoiceRecord.TotalAmount);
    if (paymentsReocrd.length > 0) {
      balance -= paymentsReocrd[0].paidAmount;
    }
    invoiceRecord.companyName = companySettingsRecord
      ? companySettingsRecord.companyName
      : "";
    invoiceRecord.balance = balance;
    invoiceRecord.currencySymbol =
      preferenceSettings.currencyId.currency_symbol;
    invoiceRecord.currencyCode =
      preferenceSettings.currencyId.country_currency_short_code.toLowerCase();
    response.success_message(invoiceRecord, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.paymentSettingsDetails = async (req, res) => {
  try {
    const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
    let result = {
      stripeInfo: {},
      paypalInfo: {},
    };
    if (paymentSettingsRecord) {
      result.isStripe = paymentSettingsRecord.isStripe;
      result.isPaypal = paymentSettingsRecord.isPaypal;
      if (paymentSettingsRecord.isStripe) {
        result.stripeInfo.mode = paymentSettingsRecord.stripe_account_type;

        if (paymentSettingsRecord.stripe_account_type == "LIVE") {
          result.stripeInfo.publishKey = paymentSettingsRecord.stripepublishKey;
        } else {
          result.stripeInfo.publishKey =
            paymentSettingsRecord.sandbox_stripepublishKey;
        }
      }
      if (paymentSettingsRecord.isPaypal) {
        result.paypalInfo.mode = paymentSettingsRecord.paypal_account_type;
        if (paymentSettingsRecord.paypal_account_type == "LIVE") {
          result.paypalInfo.clientId = paymentSettingsRecord.paypalClientId;
        } else {
          result.paypalInfo.clientId =
            paymentSettingsRecord.sandbox_paypalClientId;
        }
      }
      response.success_message(result, res);
    } else {
      response.validation_error_message(
        { message: "Please update payment settings , no data" },
        res
      );
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
