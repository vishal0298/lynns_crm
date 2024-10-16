const purchaseorderModel = require("../models/purchase_orders.model");
const purchaseModel = require("../../purchases/models/purchase.model");
const inventoryModel = require("../../inventory/models/inventory.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const commonDate = require("../../common/date");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const resUpdate = require("../../common/date");
const vendor = require("../../vendor/models/vendor.model");
const users = require("../../auth/models/auth.model");
const notification = require("../../notification/controllers/notification.controller");
const ledger = require("../../ledger/models/ledger.model");
const ledgerModel = require("../../ledger/models/ledger.model");

var data;

exports.create = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const purchaseOrderCount = await purchaseorderModel.find({}).count();
    const bankValue = request.bank;
    const bankObjectId = bankValue ? mongoose.Types.ObjectId(bankValue) : null;

    let count = purchaseOrderCount + 1;
    const purchaseRec = await purchaseorderModel.create({
      purchaseOrderId: request.purchaseOrderId,
      vendorId: request.vendorId,
      purchaseOrderDate: request.purchaseOrderDate,
      dueDate: request.dueDate,
      referenceNo: request.referenceNo,
      items: request.items,
      // discountType: request.discountType,
      //  status: "PAID",
      // paymentMode: "CASH",
      // discount: request.discount,
      // tax: request.tax,
      taxableAmount: request.taxableAmount,
      totalDiscount: request.totalDiscount,
      vat: request.vat,
      roundOff: request.roundOff,
      TotalAmount: request.TotalAmount,
      bank: bankObjectId,
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
      let data = {
        message: "Purchase order created successfully",
      };
      const vendorName = await vendor.findOne(request._id);

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `PurchaseOrder has been created for ${vendorName.vendor_name}`,
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
    console.log("error:", error);
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
    const purchaseOrderRecordsCount = await purchaseorderModel
      .find(filter)
      .count();
    const purchaseOrderRecs = await purchaseorderModel
      .find(filter)
      .sort({ _id: -1 })
      .populate({ path: "vendorInfo" })
      .populate({ path: "signatureId" })
      .skip(request.skip)
      .limit(request.limit)
      .lean();
    purchaseOrderRecs.forEach((item) => {
      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      item.createdAt = resUpdate.resDate(item.createdAt);
      if (item.signatureId) {
        item.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureId.signatureImage}`;
      }
    });

    response.success_message(purchaseOrderRecs, res, purchaseOrderRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const purchaseOrderRec = await purchaseorderModel
      .findOne({ _id: req.params.id })
      .populate("vendorId")
      .populate("signatureId")
      .populate("bank");
    if (purchaseOrderRec.signatureImage) {
      purchaseOrderRec.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${purchaseOrderRec.signatureImage}`;
    }
    if (purchaseOrderRec.signatureId) {
      purchaseOrderRec.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${purchaseOrderRec.signatureId.signatureImage}`;
    }
    response.success_message(purchaseOrderRec, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const purchase_orders_id = req.params.id;
    const purchaseRec = await purchaseorderModel.findById(purchase_orders_id);
    const bankValue = request.bank;
    const bankObjectId = bankValue ? mongoose.Types.ObjectId(bankValue) : null;

    let newImage = purchaseRec.signatureImage;
    if (req.file) {
      newImage = req.file.path;
      if (
        purchaseRec.signatureImage !== "" &&
        fs.existsSync(purchaseRec.signatureImage)
      ) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, purchaseRec.signatureImage);
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {
      purchaseOrderId: request.purchaseOrderId,
      vendorId: request.vendorId,
      purchaseOrderDate: request.purchaseOrderDate,
      dueDate: request.dueDate,
      referenceNo: request.referenceNo,
      items: request.items,
      taxableAmount: request.taxableAmount,
      totalDiscount: request.totalDiscount,
      vat: request.vat,
      roundOff: request.roundOff,
      TotalAmount: request.TotalAmount,
      bank: bankObjectId,
      notes: request.notes,
      termsAndCondition: request.termsAndCondition,
      sign_type: request.sign_type,
      signatureId:
        request.sign_type !== "eSignature" ? request.signatureId : null,
      signatureName:
        request.sign_type === "eSignature" ? request.signatureName : null,
      signatureImage: request.sign_type === "eSignature" ? newImage : null,
      userId: authUser.id,
      isDeleted: false,
    };

    const updated_purchase_order = await purchaseorderModel.findByIdAndUpdate(
      purchase_orders_id,
      updateData,
      { new: true }
    );

    if (updated_purchase_order) {
      const data = {
        message: "Purchase Order updated successfully",
        purchase_order: updated_purchase_order,
      };

      const vendorName = await vendor.findOne(request._id);

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `PurchaseOrder has been Updated for ${vendorName.vendor_name}`,
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

      return response.success_message(data, res);
    }
  } catch (error) {
    console.log("error:", error);
    return response.error_message(error.message, res);
  }
};

exports.delete = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const results = await purchaseorderModel.deleteOne({ _id: req.params.id });

    if (results) {
      var message =
        results.deletedCount > 0 ? "Deleted Successfully" : "Record Not Found";

      if (purchaseorderModel) {
        let data = { message: message, deletedCount: results.deletedCount };

        const vendorName = await vendor.findOne(request._id);

        const adminRole = await users.findOne({ role: "Super Admin" });
        const notificationMessage = {
          title: "Notification Message",
          body: `PurchaseOrder has been created for ${vendorName.vendor_name}`,
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
    }
  } catch (err) {
    let data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// exports.delete = function (req, res) {
//   const auth_user = verify.verify_token(req.headers.token).details;
//     console.log('authUser ====> ? Delete', auth_user);
//   purchaseorderModel.deleteOne({ _id: req.params.id }, function (err, results) {
//     if (err) {
//       data = { message: err.message };
//       response.validation_error_message(data, res);
//     } else {
//       if (results) {
//         var message =
//           results.deletedCount > 0
//             ? "Deleted Successfully"
//             : "Record Not Found";
//         if (purchaseorderModel) {
//           let data = { message: message, deletedCount: results.deletedCount };

//           const vendorName =  vendor.findOne(request._id);
//           console.log('vendorName>>>>>>>>>>', vendorName);
//           const adminRole = users.findOne({ role: "Super Admin" });
//           const notificationMessage = {
//             title: 'Notification Message',
//             body: `PurchaseOrder has been created for ${vendorName.vendor_name}`
//           };

//           if (authUser.role !== "Super Admin") {
//             // Send FCM message to Super Admin and authUser
//              notification.sendFCMMessage(notificationMessage, [authUser.id, adminRole._id]);
//           } else {
//             // Send FCM message to authUser only
//              notification.sendFCMMessage(notificationMessage, [authUser.id]);
//           }
//            response.success_message(data, res);
//         }

//       }
//     }
//   });
// };

exports.softDelete = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    console.log("authUser ====> ? Purchase Order Delete", authUser);
    const purchaseOrder = await purchaseorderModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );
    if (purchaseOrder) {
      let data = {
        message: "Purchase Order has been Deleted Successfully",
        deletedCount: 1,
      };
      const vendorName = await vendor.findOne(req.params._id);
      console.log("vendorName>>>>>>>>>>", vendorName);
      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `PurchaseOrder has been Deleted for ${vendorName.vendor_name}`,
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
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};

//filter by vendor
exports.filterByVendor = async (req, res) => {
  try {
    let filter = {};
    let po = [];
    const vendorRec = await purchaseorderModel
      .find(filter)
      .populate({ path: "vendorInfo" });
    vendorRec.forEach((item) => {
      if (item.vendorInfo != null) {
        if (req.body.vendor_name.includes(item.vendorInfo.vendor_name)) {
          po.push(item);
        }
      }
    });
    response.success_message(po, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.filterByPurchaseOrderId = async (req, res) => {
  try {
    let filter = {};
    if (req.query.purchaseOrderId) {
      filter.purchaseOrderId = req.query.purchaseOrderId;
    }
    const purchaseRec = await purchaseorderModel.findOne(filter);
    response.success_message(purchaseRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.clonePurchaseOrder = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const originalOrderId = req.params.id;
    const purchaseOrderCount = await purchaseorderModel.find({}).count();

    let count = purchaseOrderCount + 1;

    const originalPurchaseOrder = await purchaseorderModel
      .findById(originalOrderId)
      .populate("vendorInfo");
    if (originalPurchaseOrder.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(originalPurchaseOrder.signatureImage);
      const purchaseOrderImagePath = `./uploads/purchase_orders/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(
        `./${originalPurchaseOrder.signatureImage}`,
        purchaseOrderImagePath
      );

      originalPurchaseOrder.signatureImage = purchaseOrderImagePath;
    }

    if (!originalPurchaseOrder) {
      return res
        .status(404)
        .json({ error: "Original purchase order not found" });
    }

    originalPurchaseOrder.purchaseOrderId = `PO-${count
      .toString()
      .padStart(6, "0")}`;
    const clonedPurchaseOrder = new purchaseorderModel(
      originalPurchaseOrder.toObject()
    );

    clonedPurchaseOrder._id = mongoose.Types.ObjectId();
    clonedPurchaseOrder.isCloned = true;

    const savedPurchaseOrder = await clonedPurchaseOrder.save();

    if (Array.isArray(savedPurchaseOrder)) {
      savedPurchaseOrder.forEach((item) => {
        item.createdAt = resUpdate.resDate(item.createdAt);
      });
    }
    response.success_message(savedPurchaseOrder, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to clone purchase order" });
  }
};

exports.convertToPurchase = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;

    const purchaseOrderCount = await purchaseModel.find({}).count();
    let count = purchaseOrderCount + 1;

    // Retrieve the purchase order to be converted
    const purchaseOrder = await purchaseorderModel.findById(request._id);
    let purchaseImagePath = "";
    if (purchaseOrder.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(purchaseOrder.signatureImage);
      purchaseImagePath = `./uploads/purchases/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(`./${purchaseOrder.signatureImage}`, purchaseImagePath);
    }

    // Create a new purchase record using the purchase order data
    const newPurchase = new purchaseModel({
      purchaseId: `PUR-${count.toString().padStart(6, "0")}`,
      vendorId: purchaseOrder.vendorId,
      // purchaseDate: purchaseOrder.purchaseOrderDate,
      purchaseDate: new Date().toDateString(),
      dueDate: purchaseOrder.dueDate,
      referenceNo: purchaseOrder.referenceNo,
      items: purchaseOrder.items,
      taxableAmount: purchaseOrder.taxableAmount,
      totalDiscount: purchaseOrder.totalDiscount,
      vat: purchaseOrder.vat,
      status: "PAID",
      paymentMode: "CASH",
      //    purchaseDate: new Date(),
      roundOff: purchaseOrder.roundOff,
      TotalAmount: purchaseOrder.TotalAmount,
      bank: purchaseOrder.bank,
      notes: purchaseOrder.notes,
      termsAndCondition: purchaseOrder.termsAndCondition,
      sign_type: purchaseOrder.sign_type,
      signatureName: purchaseOrder.signatureName,
      signatureImage: purchaseImagePath,
      signatureId: purchaseOrder.signatureId ? purchaseOrder.signatureId : null,
      userId: authUser.id,
    });

    // Save the new purchase record
    const savedPurchase = await newPurchase.save();

    if (savedPurchase) {
      savedPurchase.items.forEach(async (item) => {
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
          obj.quantity = parseInt(item.quantity);
          obj.units = item.unit;
          obj.notes = request.notes;
          obj.user_id = authUser.id;
          obj.created_at = new Date();
          const inventoryRec = await inventoryModel.create(obj);
        }
      });

      await ledgerModel.create({
        referenceId: savedPurchase._id,
        name: savedPurchase.purchaseId,
        date: new Date(),
        reference: `${savedPurchase.purchaseId} purchase creation`,
        mode: "Credit",
        amount: Number(purchaseOrder.TotalAmount),
        vendorId: purchaseOrder.vendorId,
        created_at: new Date(),
        updated_at: new Date(),
      });

      let data = {
        message: "purchase converted successfully",
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};

exports.getPurchaseOrderNumber = async (req, res) => {
  try {
    const purchaseOrderRecords = await purchaseorderModel.find().count();
    const purchaseOrderNumber = `PO-${(purchaseOrderRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(purchaseOrderNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
