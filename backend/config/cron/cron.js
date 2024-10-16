const invoiceModel = require("../../api/invoice/models/invoice.model");
const inventoryModel = require("../../api/inventory/models/inventory.model");
const notificationModel = require("../../api/notification/models/notification.model");
const response = require("../../response");
const notification = require("../../api/notification/controllers/notification.controller");
const invoiceSettingsModel = require("../../api/invoiceSettings/models/invoiceSettings.model");
const userModel = require("../../api/auth/models/auth.model");
const path = require("path");
const moment = require("moment");
const fs = require("fs");
const mongoose = require("mongoose");

const recurringInvoiceGenerate = async () => {
  try {
    console.log("Cron job started");
    const invoiceRecords = await invoiceModel
      .find({
        isReccuring: true,
        isRecuuringCancelled: false,
        renewalDates: { $in: moment().format("DD-MM-YYYY") },
      })
      .lean();
    if (invoiceRecords.length > 0) {
      for (const record of invoiceRecords) {
        let minQuanProducts = [];
        notificationDataString = "";
        for (const item of record.items) {
          const invRec = await inventoryModel.findOne({
            productId: item.productId,
          });
          if (invRec == null) {
            minQuanProducts.push(`${item.name} has only 0 quantity`);
          } else if (invRec.quantity < parseInt(item.quantity)) {
            minQuanProducts.push(
              `${item.name} has only ${invRec.quantity} quantity`
            );
            notificationDataString += `${
              item.name.charAt(0).toUpperCase() + item.name.substring(1)
            }-${invRec.quantity}, `;
          }
        }
        if (minQuanProducts.length > 0) {
          let ids = [];
          const userRecord = await userModel
            .findOne({ role: "Super Admin" })
            .lean();
          if (userRecord) {
            ids.push(userRecord._id);
          }
          let data = {
            title: `recurring invoice generation failed due to low quantity for the invoice Number ${record.invoiceNumber}`,
            body: notificationDataString,
          };
          await notificationModel.create({
            title: `recurring invoice generation failed due to low quantity for the invoice Number ${record.invoiceNumber}`,
            body: notificationDataString,
            userId: userRecord._id,
          });
          console.log("data :", data);
          await notification.sendFCMMessage(data, ids);
        } else {
          const invoiceSettings = await invoiceSettingsModel.find().lean();

          const invoiceRecordCount = await invoiceModel.find().count();
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(record.signatureImage);
          const invoiceImagePath = `./uploads/invoices/signatureImage-${
            uniqueSuffix + ext
          }`;
          fs.copyFileSync(`./${record.signatureImage}`, invoiceImagePath);

          record.signatureImage = invoiceImagePath;
          record._id = mongoose.Types.ObjectId();
          record.status = "DRAFTED";
          record.renewalDates = [];
          record.invoiceDate = moment().format("DD/MM/YYYY");
          record.invoiceNumber = `${
            invoiceSettings[0]?.invoicePrefix
              ? invoiceSettings[0]?.invoicePrefix
              : ""
          }${invoiceRecordCount + (1).toString().padStart(6, "0")}`;
          const invoiceRecord = await invoiceModel.create(record);
          if (invoiceRecord) {
            for (const item of invoiceRecord.items) {
              const inventoryRecord = await inventoryModel.findOne({
                productId: item.productId,
              });
              if (inventoryRecord) {
                let updatedQty =
                  inventoryRecord.quantity - parseInt(item.quantity);
                const updatedRec = await inventoryModel.findByIdAndUpdate(
                  inventoryRecord._id,
                  {
                    $set: {
                      quantity: updatedQty,
                    },
                  }
                );
              }
            }
          }
        }
      }
      console.log("Cron job completed");
    } else {
      console.log("Cron job completed without invoice generation");

      return;
    }
  } catch (error) {
    console.log("error :", error);
  }
};

module.exports = recurringInvoiceGenerate;
