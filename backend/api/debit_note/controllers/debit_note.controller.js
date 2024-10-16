const debitnoteModel = require("../models/debit_note.model");
const vendorModel = require("../../vendor/models/vendor.model");
const categoryModel = require("../../category/models/category.model");
const inventoryModel = require("../../inventory/models/inventory.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const mongoose = require("mongoose");
const commonDate = require("../../common/date");
const path = require("path");
const resUpdate = require("../../common/date");
const fs = require("fs");
const notification = require("../../notification/controllers/notification.controller");
const vendor = require("../../vendor/models/vendor.model");
const users = require("../../auth/models/auth.model");
const ledgerModel = require("../../ledger/models/ledger.model");

const moment = require("moment");

var data;

exports.create = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const debitNoteCount = await debitnoteModel.find({}).count();

    let count = debitNoteCount + 1;

    try {
      let minQuanProducts = [];
      for (const item of request.items) {
        const invRec = await inventoryModel.findOne({
          productId: item.productId,
        });
        if (invRec == null) {
          minQuanProducts.push(`${item.name} has only 0 quantity`);
        } else if (invRec.quantity < parseInt(item.quantity)) {
          minQuanProducts.push(
            `${item.name} has only ${invRec.quantity} quantity`
          );
        }
      }
      if (minQuanProducts.length > 0) {
        response.validation_error_message({ message: minQuanProducts }, res);
        return; // Exit the function to prevent further execution
      }

      const debitrec = await debitnoteModel.create({
        debit_note_id: request.debit_note_id,
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

      if (debitrec) {
        for (const item of debitrec.items) {
          const inventoryRecord = await inventoryModel.findOne({
            productId: item.productId,
          });
          if (inventoryRecord) {
            let updatedQty = inventoryRecord.quantity - parseInt(item.quantity);
            await inventoryModel.findByIdAndUpdate(inventoryRecord._id, {
              $set: {
                quantity: updatedQty,
              },
            });
          }
        }
        await ledgerModel.create({
          referenceId: debitrec._id,
          name: debitrec.debit_note_id,
          date: new Date(),
          reference: `${debitrec.debit_note_id} purchase return creation`,
          mode: "Debit",
          amount: Number(debitrec.TotalAmount),
          vendorId: debitrec.vendorId,
          created_at: new Date(),
          updated_at: new Date(),
        });
        const vendorId = request.vendorId;
        const vendorName = await vendor.findOne({ _id: vendorId });

        if (vendorName) {
          const adminRole = await users.findOne({ role: "Super Admin" });
          const notificationMessage = {
            title: "Notification Message",
            body: `Debit Note has been created for ${vendorName.vendor_name}`,
          };

          if (authUser.role !== "Super Admin") {
            // Send FCM message to Super Admin and authUser
            await notification.sendFCMMessage(notificationMessage, [
              authUser.id,
              adminRole._id,
            ]);
          } else {
            // Send FCM message to authUser only
            await notification.sendFCMMessage(notificationMessage, [
              authUser.id,
            ]);
          }

          response.success_message(
            { message: "Debit Note created successfully" },
            res
          );
        } else {
          response.error_message({ message: "Vendor not found." }, res);
        }
      } else {
        response.error_message({ message: "Failed." }, res);
      }
    } catch (err) {
      response.validation_error_message({ message: err.message }, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    var filter = {};
    filter.isDeleted = false;
    if (request.vendor) {
      let splittedVal = request.vendor.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter.vendorId = { $in: splittedVal };
    }
    const debitNoteRecordsCount = await debitnoteModel.find(filter).count();
    const debitRecord = await debitnoteModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(request.skip)
      .limit(request.limit)
      .populate({ path: "signatureId" })
      .populate({ path: "vendorId", select: "-updated_at -__v" })
      .lean()
      .select("-__v -updated_at");

    debitRecord.forEach((item) => {
      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      if (item.signatureId) {
        item.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureId.signatureImage}`;
      }
    });

    response.success_message(debitRecord, res, debitNoteRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const debitinfo = await debitnoteModel
      .findOne({ _id: req.params.id })
      .populate({ path: "signatureId" })
      .populate({ path: "vendorId", select: "-updated_at -__v" });

    if (debitinfo) {
      if (debitinfo.signatureImage) {
        debitinfo.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${debitinfo.signatureImage}`;
      }
      data = {
        debit_details: debitinfo,
      };
      if (debitinfo.signatureId) {
        debitinfo.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${debitinfo.signatureId.signatureImage}`;
      }

      response.success_message(debitinfo, res);
    } else {
      data = {
        debit_details: [],
        message: "No result found",
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
    const requestId = req.params.id;
    const requestData = req.body;

    let requestItems = [];
    requestData.items.forEach((item) => {
      let obj = {};
      obj.productId = item.productId;
      obj.quantity = item.quantity;
      obj.name = item.name;
      requestItems.push(obj);
    });

    const debitrec = await debitnoteModel.findById(requestId);
    let dbRec = debitrec;

    debitrec.items.forEach((item) => {
      requestItems.forEach((reqItem) => {
        if (item.productId == reqItem.productId) {
          reqItem.quantity =
            parseInt(reqItem.quantity) - parseInt(item.quantity);
        }
      });
    });

    let minQuanProducts = [];
    for (const item of requestItems) {
      let iteratedIds = [];
      const invRec = await inventoryModel
        .findOne({
          productId: item.productId,
        })
        .lean();
      if (
        !iteratedIds.includes(invRec.productId) &&
        invRec.quantity < parseInt(item.quantity)
      ) {
        dbRec.items.forEach((item) => {
          if (item.productId == invRec.productId) {
            iteratedIds.push(invRec.productId);
          }
        });
        minQuanProducts.push(
          `${item.name} has only ${invRec.quantity} quantity`
        );
      }
    }

    if (minQuanProducts.length > 0) {
      response.validation_error_message({ message: minQuanProducts }, res);
    } else {
      let newImage = debitrec.signatureImage;
      if (req.file) {
        newImage = req.file.path;
        if (
          debitrec.signatureImage !== "" &&
          fs.existsSync(debitrec.signatureImage)
        ) {
          const rootDir = path.resolve("./");
          let oldImagePath = path.join(rootDir, debitrec.signatureImage);
          fs.unlinkSync(oldImagePath);
        }
      }

      var newvalues = {
        $set: {
          debit_note_id: requestData.debit_note_id,
          vendorId: requestData.vendorId,
          purchaseOrderDate: requestData.PurchaseOrderDate,
          dueDate: requestData.dueDate,
          referenceNo: requestData.referenceNo,
          items: requestData.items,
          paymentMode: requestData.paymentMode,
          taxableAmount: requestData.taxableAmount,
          totalDiscount: requestData.totalDiscount,
          vat: requestData.vat,
          roundOff: requestData.roundOff,
          TotalAmount: requestData.TotalAmount,
          bank: requestData.bank,
          notes: requestData.notes,
          termsAndCondition: requestData.termsAndCondition,
          sign_type: requestData.sign_type,
          signatureId:
            requestData.sign_type !== "eSignature"
              ? requestData.signatureId
              : null,
          signatureName:
            requestData.sign_type === "eSignature"
              ? requestData.signatureName
              : null,
          signatureImage:
            requestData.sign_type === "eSignature" ? newImage : null,
          userId: authUser.id,
          isDeleted: false,
        },
      };

      if (requestData.status && requestData.status != "") {
        newvalues.$set.status = requestData.status;
      }

      const debitDetails = await debitnoteModel.findByIdAndUpdate(
        requestId,
        newvalues,
        { new: true }
      );

      if (debitDetails) {
        for (let item of debitrec.items) {
          const inventoryRecord = await inventoryModel.findOne({
            productId: item.productId,
          });
          const updatedQty = inventoryRecord.quantity + parseInt(item.quantity);
          await inventoryModel.findByIdAndUpdate(
            inventoryRecord._id,
            {
              $set: {
                quantity: updatedQty,
              },
            },
            { new: true }
          );
        }

        debitDetails.items.forEach(async (item) => {
          const inventoryRecord = await inventoryModel
            .findOne({
              productId: item.productId,
            })
            .lean();

          if (inventoryRecord) {
            const updatedQuan =
              parseInt(inventoryRecord.quantity) - parseInt(item.quantity);

            await inventoryModel.findByIdAndUpdate(
              inventoryRecord._id,
              {
                $set: {
                  quantity: updatedQuan,
                },
              },
              { new: true }
            );
          } else {
            let obj = {};
            obj.productId = item.productId;
            obj.quantity = -item.quantity;
            obj.units = item.unit;
            obj.notes = requestData.notes;
            obj.userId = authUser.id;
            obj.created_at = new Date();

            await inventoryModel.create(obj);
          }
        });
        const amount =
          Number(debitDetails.TotalAmount) - Number(debitrec.TotalAmount);
        await ledgerModel.create({
          referenceId: debitDetails._id,
          name: debitDetails.debit_note_id,
          date: new Date(),
          reference: `${debitDetails.debit_note_id} purchase return update`,
          mode: amount > 0 ? "Debit" : "Credit",
          amount: Math.abs(amount),
          vendorId: debitDetails.vendorId,
          created_at: new Date(),
          updated_at: new Date(),
        });
        const vendorId = requestData.vendorId;
        const vendorName = await vendor.findOne({ _id: vendorId });

        if (vendorName) {
          const adminRole = await users.findOne({ role: "Super Admin" });
          const notificationMessage = {
            title: "Notification Message",
            body: `Debit Note has been updated for ${vendorName.vendor_name}`,
          };

          if (authUser.role !== "Super Admin") {
            // Send FCM message to Super Admin and authUser
            await notification.sendFCMMessage(notificationMessage, [
              authUser.id,
              adminRole._id,
            ]);
          } else {
            // Send FCM message to authUser only
            await notification.sendFCMMessage(notificationMessage, [
              authUser.id,
            ]);
          }

          response.success_message(
            { message: "Debit Note Updated successfully" },
            res
          );
        } else {
          response.error_message({ message: "Vendor not found." }, res);
        }
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const debitnote = await debitnoteModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );
    if (debitnote) {
      for (const item of debitnote.items) {
        const inventoryRecord = await inventoryModel.findOne({
          productId: item.productId,
        });
        let updatedQty = inventoryRecord.quantity + parseInt(item.quantity);
        await inventoryModel.findByIdAndUpdate(inventoryRecord._id, {
          $set: {
            quantity: updatedQty,
          },
        });
      }
      await ledgerModel.create({
        referenceId: debitnote._id,
        name: debitnote.debit_note_id,
        date: new Date(),
        reference: `${debitnote.debit_note_id} purchase return cancellation`,
        mode: "Credit",
        amount: debitnote.TotalAmount,
        vendorId: debitnote.vendorId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      let vendorName = null;
      if (debitnote.vendorId) {
        vendorName = await vendor.findOne({ _id: debitnote.vendorId });
      }
      const notificationMessage = {
        title: "Notification Message",
        body: `Debit Note has been Deleted${
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

      let data = {
        message: "Debit Note has been Deleted Successfully",
        deletedCount: 1,
      };
      response.success_message(data, res);
    }
  } catch (error) {
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};

//filter by vendor

exports.clonedDebitNote = async function (req, res) {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const originalDebitId = req.params.id;
    const originaldebitNote = await debitnoteModel.findById(originalDebitId);
    if (!originaldebitNote) {
      return res.status(404).json({ error: "Original Debit Notes not found" });
    }
    if (originaldebitNote.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(originaldebitNote.signatureImage);
      const debitNoteImagePath = `./uploads/debit_note/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(
        `./${originaldebitNote.signatureImage}`,
        debitNoteImagePath
      );

      originaldebitNote.signatureImage = debitNoteImagePath;
    }

    let minQuanProducts = [];
    for (const item of originaldebitNote.items) {
      const invRec = await inventoryModel.findOne({
        productId: item.productId,
      });
      if (invRec.quantity < parseInt(item.quantity)) {
        minQuanProducts.push(
          `${item.name} has only ${invRec.quantity} quantity`
        );
      }
    }
    if (minQuanProducts.length > 0) {
      response.validation_error_message({ message: minQuanProducts }, res);
    } else {
      const debitNoteCount = await debitnoteModel.find({}).count();

      let count = debitNoteCount + 1;

      originaldebitNote.debit_note_id = `DEBIT-${count
        .toString()
        .padStart(6, "0")}`;
      const clonedDebitNote = new debitnoteModel(originaldebitNote.toObject());
      clonedDebitNote._id = mongoose.Types.ObjectId();
      clonedDebitNote.isCloned = true;

      const savedPurchaseOrder = await clonedDebitNote.save();
      if (savedPurchaseOrder) {
        for (const item of savedPurchaseOrder.items) {
          const inventoryRecord = await inventoryModel.findOne({
            productId: item.productId,
          });
          if (inventoryRecord) {
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
        }
        if (savedPurchaseOrder.signatureImage) {
          savedPurchaseOrder.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${savedPurchaseOrder.signatureImage}`;
        }
        await ledgerModel.create({
          referenceId: savedPurchaseOrder._id,
          name: savedPurchaseOrder.debit_note_id,
          date: new Date(),
          reference: `${savedPurchaseOrder.debit_note_id} purchase return creation`,
          mode: "Debit",
          amount: Number(savedPurchaseOrder.TotalAmount),
          vendorId: savedPurchaseOrder.vendorId,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return res.status(200).json({ clonedDebitNote: savedPurchaseOrder });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to Clone Debit Notes" });
  }
};

exports.getDebitNoteNumber = async (req, res) => {
  try {
    const purchaseOrderRecords = await debitnoteModel.find().count();
    const purchaseOrderNumber = `DEBIT-${(purchaseOrderRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(purchaseOrderNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
