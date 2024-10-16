const response = require("../../../response");
const verify = require("../../../verify.token");
const purchaseModel = require("../models/purchase.model");
const inventoryModel = require("../../inventory/models/inventory.model");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const resUpdate = require("../../common/date");
const notification = require("../../notification/controllers/notification.controller");
const vendor = require("../../vendor/models/vendor.model");
const users = require("../../auth/models/auth.model");
const mongoose = require("mongoose");
const ledgerModel = require("../../ledger/models/ledger.model");

exports.create = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const purchaseCount = await purchaseModel.find({}).count();
    let count = purchaseCount + 1;
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const purchaseRec = await purchaseModel.create({
      purchaseId: `PUR-${count.toString().padStart(6, "0")}`,
      vendorId: request.vendorId,
      purchaseDate: request.purchaseDate,
      // dueDate: request.dueDate,
      referenceNo: request.referenceNo,
      supplierInvoiceSerialNumber: request.supplierInvoiceSerialNumber,
      items: request.items,
      discountType: request.discountType,
      status: "PAID",
      paymentMode: "CASH",
      discount: request.discount,
      tax: request.tax,
      taxableAmount: request.taxableAmount,
      totalDiscount: request.totalDiscount,
      vat: request.vat,
      roundOff: request.roundOff,
      TotalAmount: request.TotalAmount,
      bank: request.bank,
      notes: request.notes,
      termsAndCondition: request.termsAndCondition,
      sign_type: request.sign_type,
      signatureId: request.signatureId,
      signatureName: request.signatureName,
      signatureImage: request.sign_type === "eSignature" ? filePath : null,
      userId: authUser.id,
      isDeleted: false,
    });
    if (purchaseRec) {
      purchaseRec.items.forEach(async (item) => {
        const inventoryRecord = await inventoryModel.findOne({
          productId: item.productId,
        });
        if (inventoryRecord) {
          let updatedQty = inventoryRecord.quantity + parseInt(item.quantity);
          const updatedRec = await inventoryModel.findByIdAndUpdate(
            inventoryRecord._id,
            {
              $set: {
                quantity: updatedQty,
              },
            }
          );
        } else {
          let obj = {};
          obj.productId = item.productId;
          obj.quantity = item.quantity;
          obj.units = item.unit;
          obj.notes = request.notes;
          obj.user_id = authUser.id;
          obj.created_at = new Date();
          const inventoryRec = await inventoryModel.create(obj);
        }
      });
      await ledgerModel.create({
        referenceId: purchaseRec._id,
        name: purchaseRec.purchaseId,
        date: new Date(),
        reference: `${purchaseRec.purchaseId} Purchase  creation`,
        mode: "Credit",
        amount: Number(purchaseRec.TotalAmount),
        vendorId: purchaseRec.vendorId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const vendorName = await vendor.findOne({ _id: request.vendorId });

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `Purchase has been created for ${vendorName.vendor_name}`,
      };

      if (authUser.role !== "Super Admin") {
        // Send FCM message to Super Admin and authUser
        await notification.sendFCMMessage(notificationMessage, [
          authUser.id,
          adminRole._id,
        ]);
      } else {
        // Send FCM message to authUser only
        await notification.sendFCMMessage(notificationMessage, [authUser.id]);
      }

      let data = {
        message: "Purchase created successfully",
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const imageRec = await purchaseModel.findById(req.params.id);
    let filePath = imageRec.signatureImage;
    if (req.file) {
      filePath = req.file.path;
      if (
        imageRec.signatureImage !== "" &&
        fs.existsSync(imageRec.signatureImage)
      ) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, imageRec.signatureImage);
        fs.unlinkSync(oldImagePath);
      }
    }
    const purchaseRec = await purchaseModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          purchaseId: request.purchaseId,
          vendorId: request.vendorId,
          purchaseDate: request.purchaseDate,
          // dueDate: request.dueDate,
          referenceNo: request.referenceNo,
          supplierInvoiceSerialNumber: request.supplierInvoiceSerialNumber,
          items: request.items,
          discountType: request.discountType,
          status: "PAID",
          paymentMode: "CASH",
          discount: request.discount,
          tax: request.tax,
          taxableAmount: request.taxableAmount,
          totalDiscount: request.totalDiscount,
          vat: request.vat,
          roundOff: request.roundOff,
          TotalAmount: request.TotalAmount,
          bank: request.bank,
          notes: request.notes,
          termsAndCondition: request.termsAndCondition,
          sign_type: request.sign_type,
          signatureId:
            request.sign_type !== "eSignature" ? request.signatureId : null,
          signatureName:
            request.sign_type === "eSignature" ? request.signatureName : null,
          signatureImage: request.sign_type === "eSignature" ? filePath : null,
          userId: authUser.id,
        },
      },
      { new: true }
    );
    if (purchaseRec) {
      for (let item of imageRec.items) {
        const inventoryRecord = await inventoryModel.findOne({
          productId: item.productId,
        });
        let updatedQty = inventoryRecord.quantity - parseInt(item.quantity);
        const updatedRec = await inventoryModel.findByIdAndUpdate(
          inventoryRecord._id,
          {
            $set: {
              quantity: updatedQty,
            },
          }
        );
      }
      purchaseRec.items.forEach(async (item) => {
        const inventoryRecord = await inventoryModel.findOne({
          productId: item.productId,
        });
        if (inventoryRecord) {
          let updatedQty = inventoryRecord.quantity + parseInt(item.quantity);
          const updatedRec = await inventoryModel.findByIdAndUpdate(
            inventoryRecord._id,
            {
              $set: {
                quantity: updatedQty,
              },
            }
          );
        } else {
          let obj = {};
          obj.productId = item.productId;
          obj.quantity = item.quantity;
          obj.units = item.unit;
          obj.notes = request.notes;
          obj.user_id = authUser.id;
          obj.created_at = new Date();
          const inventoryRec = await inventoryModel.create(obj);
        }
      });
      const amount =
        Number(purchaseRec.TotalAmount) - Number(imageRec.TotalAmount);
      await ledgerModel.create({
        referenceId: purchaseRec._id,
        name: purchaseRec.purchaseId,
        date: new Date(),
        reference: `${purchaseRec.purchaseId} purchase update`,
        mode: amount > 0 ? "Credit" : "Debit",
        amount: Math.abs(amount),
        vendorId: purchaseRec.vendorId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      let data = {
        message: "purchase updated successfully",
      };
      await notification.minStockAlert(req, res);

      const vendorName = await vendor.findOne({ _id: request.vendorId });

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `Purchase has been updated for ${vendorName.vendor_name}`,
      };

      if (authUser.role !== "Super Admin") {
        // Send FCM message to Super Admin and authUser
        await notification.sendFCMMessage(notificationMessage, [
          authUser.id,
          adminRole._id,
        ]);
      } else {
        // Send FCM message to authUser only
        await notification.sendFCMMessage(notificationMessage, [authUser.id]);
      }

      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    let filter = {
      isDeleted: false,
    };

    if (request.vendor) {
      let splittedVal = request.vendor.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter.vendorId = { $in: splittedVal };
    }
    const purchaseRecordsCount = await purchaseModel.find(filter).count();
    const purchaseRecs = await purchaseModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(request.skip)
      .limit(request.limit)
      .populate("vendorId")
      .populate("signatureId")
      .lean();

    purchaseRecs.forEach((item) => {
      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      if (item.signatureId && item.signatureId.signatureImage) {
        item.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureId.signatureImage}`;
      }
      if (!item.signatureId) {
        item.signatureId = {}; // Set an empty object if signatureId doesn't exist
      }
    });
    response.success_message(purchaseRecs, res, purchaseRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const purchaseRecord = await purchaseModel
      .findOne({ _id: req.params.id })
      .populate("vendorId")
      .populate("signatureId")
      .lean();
    if (purchaseRecord.signatureImage) {
      purchaseRecord.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${purchaseRecord.signatureImage}`;
    }
    if (purchaseRecord.signatureId) {
      purchaseRecord.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${purchaseRecord.signatureId.signatureImage}`;
    }

    if (!purchaseRecord.signatureId) {
      purchaseRecord.signatureId = {};
    }
    response.success_message(purchaseRecord, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.delete = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const purchaseRec = await purchaseModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (purchaseRec) {
      for (const item of purchaseRec.items) {
        const inventoryRecord = await inventoryModel.findOne({
          productId: item.productId,
        });
        let updatedQty = inventoryRecord.quantity - parseInt(item.quantity);
        await inventoryModel.findByIdAndUpdate(inventoryRecord._id, {
          $set: {
            quantity: updatedQty,
          },
        });
      }
      await ledgerModel.create({
        referenceId: purchaseRec._id,
        name: purchaseRec.purchaseId,
        date: new Date(),
        reference: `${purchaseRec.purchaseId} purchase cancellation`,
        mode: "Debit",
        amount: Number(purchaseRec.TotalAmount),
        vendorId: purchaseRec.vendorId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      let vendorName = null;
      if (purchaseRec.vendorId) {
        vendorName = await vendor.findOne({ _id: purchaseRec.vendorId });
      }

      const notificationMessage = {
        title: "Notification Message",
        body: `Purchase has been Deleted${
          vendorName ? ` for ${vendorName.vendor_name}` : ""
        }`,
      };

      const adminRole = await users.findOne({ role: "Super Admin" });

      if (authUser.role !== "Super Admin") {
        // Send FCM message to Super Admin and authUser
        await notification.sendFCMMessage(notificationMessage, [
          authUser.id,
          adminRole._id,
        ]);
      } else {
        // Send FCM message to authUser only
        await notification.sendFCMMessage(notificationMessage, [authUser.id]);
      }

      // const data = { message: "Purchase deleted successfully." };
      let data = {
        message: "Purchase has been Deleted Successfully",
        deletedCount: 1,
      };

      response.success_message(data, res);
    } else {
      throw new Error("Purchase record not found.");
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
