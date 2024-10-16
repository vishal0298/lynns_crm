const creditnoteModel = require("../models/credit_note.model");
const customerModel = require("../../customers/models/customers.model");
const inventoryModel = require("../../inventory/models/inventory.model");
const deliverychallanModel = require("../../delivery_challans/models/delivery_challans.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const resUpdate = require("../../common/date");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const notification = require("../../notification/controllers/notification.controller");
const users = require("../../auth/models/auth.model");
const moment = require("moment");
var data;

exports.create = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const crnCount = await creditnoteModel.find({}).count();
    let filePath = "";

    if (req.file) {
      filePath = req.file.path;
    }

    let count = crnCount + 1;
    const bankValue = request.bank;
    const bankObjectId = bankValue ? mongoose.Types.ObjectId(bankValue) : null;

    const creditNoteRecord = await creditnoteModel.create({
      credit_note_id: request.credit_note_id,
      customerId: request.customerId,
      credit_note_date: request.credit_note_date,
      due_date: request.due_date,
      reference_no: request.reference_no,
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
      bank: bankObjectId,
      notes: request.notes,
      termsAndCondition: request.termsAndCondition,
      sign_type: request.sign_type,
      signatureId: request.signatureId,
      signatureName: request.signatureName,
      signatureImage: request.sign_type === "eSignature" ? filePath : null,
      isDeleted: false,
      userId: auth_user.id,
      created_at: new Date(),
    });

    if (creditNoteRecord) {
      creditNoteRecord.items.forEach(async (item) => {
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
          obj.user_id = auth_user.id;
          obj.created_at = new Date();
          const inventoryRec = await inventoryModel.create(obj);
        }
      });

      let data = {
        message: "Credit Note created successfully",
      };

      let customerName = null;

      if (creditNoteRecord.customerId) {
        customerName = await customerModel.findOne({
          _id: creditNoteRecord.customerId,
        });
      }
      const adminRole = await users.findOne({ role: "Super Admin" });

      const notificationMessage = {
        title: "Notification Message",
        body: `Credit Note has been created for ${
          customerName ? customerName.name : ""
        }`,
      };

      if (auth_user.role !== "Super Admin") {
        // Send FCM message to Super Admin and authUser
        await notification.sendFCMMessage(notificationMessage, [
          auth_user.id,
          adminRole._id,
        ]);
      } else {
        // Send FCM message to authUser only
        await notification.sendFCMMessage(notificationMessage, [auth_user.id]);
      }

      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error >> ", error);
    response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    let filter = {
      isDeleted: false,
    };
    if (request.customer) {
      let splittedVal = req.query.customer.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter.customerId = { $in: splittedVal };
    }
    const creditNoteRecordsCount = await creditnoteModel.find(filter).count();
    const crnRecs = await creditnoteModel
      .find(filter)
      .sort({ _id: -1 })
      .lean()
      .skip(req.query.skip)
      .limit(req.query.limit)
      .populate({ path: "customerInfo" })
      .populate("signatureId");

    crnRecs.forEach((item) => {
      item.createdAt = moment(item.createdAt).format("DD-MM-YYYY");

      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      if (
        item.customerInfo &&
        item.customerInfo.image &&
        !item.customerInfo.image.startsWith("http")
      ) {
        item.customerInfo.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.customerInfo.image}`;
      }
      if (item.signatureId && item.signatureId.signatureImage) {
        item.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureId.signatureImage}`;
      }
      // item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
    });
    response.success_message(crnRecs, res, creditNoteRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const crnRec = await creditnoteModel
      .findById(req.params.id)
      .populate("customerInfo")
      .populate("signatureId");
    if (crnRec.signatureImage) {
      crnRec.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${crnRec.signatureImage}`;
    }
    if (crnRec.signatureId) {
      crnRec.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${crnRec.signatureId.signatureImage}`;
    }
    response.success_message(crnRec, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const credit_note_id = req.params.id;
    const crn_rec = await creditnoteModel.findById(credit_note_id);
    const bankValue = request.bank;
    const bankObjectId = bankValue ? mongoose.Types.ObjectId(bankValue) : null;
    let newImage = crn_rec.signatureImage;
    if (req.file) {
      newImage = req.file.path;
      if (
        crn_rec.signatureImage !== "" &&
        fs.existsSync(crn_rec.signatureImage)
      ) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, crn_rec.signatureImage);
        fs.unlinkSync(oldImagePath);
      }
    }
    const updateData = {
      credit_note_id: request.credit_note_id,
      customerId: request.customerId,
      credit_note_date: request.credit_note_date,
      due_date: request.due_date,
      reference_no: request.reference_no,
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
      bank: bankObjectId,
      notes: request.notes,
      termsAndCondition: request.termsAndCondition,
      sign_type: request.sign_type,
      signatureId:
        request.sign_type !== "eSignature" ? request.signatureId : null,
      signatureName:
        request.sign_type === "eSignature" ? request.signatureName : null,
      signatureImage: request.sign_type === "eSignature" ? newImage : null,
      userId: auth_user.id,
      isDeleted: false,
    };

    const updatedcrn = await creditnoteModel.findByIdAndUpdate(
      credit_note_id,
      updateData,
      { new: true }
    );

    if (updatedcrn) {
      for (let item of crn_rec.items) {
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
      updatedcrn.items.forEach(async (item) => {
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
          obj.user_id = auth_user.id;
          obj.created_at = new Date();
          const inventoryRec = await inventoryModel.create(obj);
        }
      });
      await notification.minStockAlert(req, res);
      let data = {
        message: "Credit Note updated successfully",
      };
      const customerName = await customerModel.findById(request.customerId);

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `Credit Note has been updated for ${customerName.name}`,
      };

      if (auth_user.role !== "Super Admin") {
        // Send FCM message to Super Admin and authUser
        await notification.sendFCMMessage(notificationMessage, [
          auth_user.id,
          adminRole._id,
        ]);
      } else {
        // Send FCM message to authUser only
        await notification.sendFCMMessage(notificationMessage, [auth_user.id]);
      }
      response.success_message(data, res);
    } else {
      throw new Error("Failed to update credit note");
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;

    const creditNoteRecord = await creditnoteModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );

    if (creditNoteRecord) {
      for (const item of creditNoteRecord.items) {
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

      let data = {
        message: "Credit Note has been Deleted Successfully",
        deletedCount: 1,
      };

      let customerName = null;
      if (creditNoteRecord.customerId) {
        customerName = await customerModel.findOne({
          _id: creditNoteRecord.customerId,
        });
      }

      const adminRole = await users.findOne({ role: "Super Admin" });
      const notificationMessage = {
        title: "Notification Message",
        body: `Credit Note has been deleted for ${
          customerName ? customerName.name : ""
        }`,
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
    } else {
      throw new Error("Credit Note not found or already deleted.");
    }
  } catch (error) {
    const data = { message: error.message };
    response.validation_error_message(data, res);
  }
};

//convert to delivery challan
exports.convertToDeliveryChallan = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;

    const dcCount = await deliverychallanModel.find({}).count();

    let count = dcCount + 1;

    // Retrieve the credit note to be converted
    const creditNote = await creditnoteModel.findById(request._id);
    let deliveryChallanImagePath = "";
    if (creditNote.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(creditNote.signatureImage);
      deliveryChallanImagePath = `./uploads/delivery_challans/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(
        `./${creditNote.signatureImage}`,
        deliveryChallanImagePath
      );
    }

    // Create a new delivery challan using the credit note data
    const newDeliveryChallan = new deliverychallanModel({
      deliveryChallanNumber: `DC-${count.toString().padStart(6, "0")}`,
      customerId: creditNote.customerId,
      deliveryChallanDate: creditNote.credit_note_date,
      dueDate: creditNote.due_date,
      referenceNo: creditNote.reference_no,
      items: creditNote.items,
      discountType: creditNote.discountType,
      discount: creditNote.discount,
      tax: creditNote.tax,
      taxableAmount: creditNote.taxableAmount,
      totalDiscount: creditNote.totalDiscount,
      vat: creditNote.vat,
      roundOff: creditNote.roundOff,
      TotalAmount: creditNote.TotalAmount,
      bank: creditNote.bank,
      notes: creditNote.notes,
      termsAndCondition: creditNote.termsAndCondition,
      sign_type: creditNote.sign_type,
      signatureName: creditNote.signature_name,
      signatureImage: deliveryChallanImagePath,
      signatureId: creditNote.signatureId ? creditNote.signatureId : null,
      userId: auth_user.id,
    });

    // Save the new delivery challan record
    const savedChallan = await newDeliveryChallan.save();

    if (savedChallan) {
      let data = {
        message: "Delivery Challan converted successfully",
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};

exports.getCreditNotesNumber = async (req, res) => {
  try {
    const creditNoteRecords = await creditnoteModel.find().count();
    const creditNoteNumber = `CN-${(creditNoteRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(creditNoteNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
