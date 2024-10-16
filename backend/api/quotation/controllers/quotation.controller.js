const quotationModel = require("../models/quotation.model");
const customerModel = require("../../customers/models/customers.model");
const invoiceModel = require("../../invoice/models/invoice.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
var mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const resUpdate = require("../../common/date");
const inventoryModel = require("../../inventory/models/inventory.model");
const invoiceSettingsModel = require("../../invoiceSettings/models/invoiceSettings.model");
const notification = require("../../notification/controllers/notification.controller");
const users = require("../../auth/models/auth.model");

var data;

exports.create = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const qtCount = await quotationModel.find({}).count();

    let count = qtCount + 1;
    const quotationRec = await quotationModel.create({
      quotation_id: request.quotation_id,
      customerId: request.customerId,
      quotation_date: request.quotation_date,
      due_date: request.due_date,
      reference_no: request.reference_no,
      //gst: request.gst,
      //document_title: request.document_title,
      items: request.items,
      discountType: request.discountType,
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
      isDeleted: false,
      userId: auth_user.id,
      created_at: new Date(),
    });
    const customerName = await customerModel.findById(request.customerId);
    const adminRole = await users.findOne({ role: "Super Admin" });

    let data = { message: "Quotation Created successfully." };

    if (auth_user.role === "Super Admin") {
      // Send notification only to Super Admin if available
      if (adminRole) {
        await notification.sendFCMMessage(
          {
            title: "Notification Message",
            body: `Quotation has been created for ${customerName.name}`,
          },
          [adminRole._id]
        );
      } else {
        console.log("Super Admin not found in the database");
      }
    } else if (auth_user.role !== "Super Admin" && adminRole) {
      // Send notification to users who are not Super Admin but have the adminRole
      await notification.sendFCMMessage(
        {
          title: "Notification Message",
          body: `Quotation has been created for ${customerName.name}`,
        },
        [adminRole._id]
      );
    }

    response.success_message(data, res);
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

    if (request.customer) {
      let splittedVal = request.customer.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter.customerId = { $in: splittedVal };
    }

    const quotationRecordsCount = await quotationModel.find(filter).count();

    const quotationRecs = await quotationModel
      .find(filter)
      .sort({ _id: -1 })
      .populate({ path: "customerId" })
      .populate({ path: "signatureId" })
      .skip(request.skip)
      .limit(request.limit)
      .lean();

    quotationRecs.forEach((item) => {
      item.text = item.name;
      item.id = item._id;
      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      if (
        item.customerId &&
        item.customerId.image &&
        !item.customerId.image.startsWith("http")
      ) {
        item.customerId.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.customerId.image}`;
      }
      if (item.signatureId && item.signatureId.signatureImage) {
        item.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureId.signatureImage}`;
      }
    });
    response.success_message(quotationRecs, res, quotationRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const quotationRec = await quotationModel
      .findOne({ _id: req.params.id })
      .populate("customerId")
      .populate({ path: "signatureId" })
      .lean();
    if (quotationRec.signatureImage) {
      quotationRec.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${quotationRec.signatureImage}`;
    }
    if (quotationRec.signatureId) {
      quotationRec.signatureId.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${quotationRec.signatureId.signatureImage}`;
    }
    response.success_message(quotationRec, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const quotation_id = req.params.id;
    const imageRec = await quotationModel.findById(req.params.id);

    let newImage = imageRec.signatureImage;
    if (req.file) {
      newImage = req.file.path;
      if (
        imageRec.signatureImage !== "" &&
        fs.existsSync(imageRec.signatureImage)
      ) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, imageRec.signatureImage);
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {
      quotation_id: request.quotation_id,
      customerId: request.customerId,
      quotation_date: request.quotation_date,
      due_date: request.due_date,
      reference_no: request.reference_no,
      //gst: request.gst,
      //document_title: request.document_title,
      items: request.items,
      discountType: request.discountType,
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
      signatureImage: request.sign_type === "eSignature" ? newImage : null,
      isDeleted: false,
      userId: auth_user.id,
    };

    const updatedqt = await quotationModel.findByIdAndUpdate(
      quotation_id,
      updateData,
      { new: true }
    );

    if (updatedqt) {
      let data = {
        message: "Quotation updated successfully",
        // Quotation: updatedqt,
      };
      const customerName = await customerModel.findById(request.customerId);
      const adminRole = await users.findOne({ role: "Super Admin" });

      if (auth_user.role === "Super Admin") {
        // Send notification only to Super Admin if available
        if (adminRole) {
          await notification.sendFCMMessage(
            {
              title: "Notification Message",
              body: `Quotation has been updated for ${customerName.name}`,
            },
            [adminRole._id]
          );
        } else {
          console.log("Super Admin not found in the database");
        }
      } else if (auth_user.role !== "Super Admin" && adminRole) {
        // Send notification to users who are not Super Admin but have the adminRole
        await notification.sendFCMMessage(
          {
            title: "Notification Message",
            body: `Quotation has been updated for ${customerName.name}`,
          },
          [adminRole._id]
        );
      }

      response.success_message(data, res);
    } else {
      throw new Error("Failed to update quotation");
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    // let request = req.body;

    const quotation = await quotationModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );

    const quotationData = await quotationModel.findById(req.params.id);
    const customerId = quotationData ? quotationData.customerId : null;

    if (customerId) {
      const customer = await customerModel.findById(customerId);

      const adminRole = await users.findOne({ role: "Super Admin" });

      if (auth_user.role === "Super Admin") {
        // Send notification only to Super Admin if available
        if (adminRole) {
          await notification.sendFCMMessage(
            {
              title: "Notification Message",
              body: `Quotation has been Deleted for ${
                customer ? customer.name : "Unknown Customer"
              }`,
            },
            [adminRole._id]
          );
        } else {
          console.log("Super Admin not found in the database");
        }
      } else if (auth_user.role !== "Super Admin" && adminRole) {
        // Send notification to users who are not Super Admin but have the adminRole
        await notification.sendFCMMessage(
          {
            title: "Notification Message",
            body: `Quotation has been Deleted for ${
              customer ? customer.name : "Unknown Customer"
            }`,
          },
          [adminRole._id]
        );
      }

      let data = {
        message: "Quotation has been Deleted Successfully",
        deletedCount: 1,
      };
      response.success_message(data, res);
    } else {
      throw new Error("Invalid quotation ID or customer ID not found");
    }
  } catch (error) {
    let data = { message: error.message };
    console.log("Error ------> notification", error);
    response.validation_error_message(data, res);
  }
};

exports.convertToInvoice = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;

    const invoiceModelcount = await invoiceModel.find({}).count();
    let count = invoiceModelcount + 1;

    // Retrieve the quotation to be converted
    const quotation = await quotationModel.findById(request._id);
    let invoiceImagePath = "";
    if (quotation.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(quotation.signatureImage);
      invoiceImagePath = `./uploads/invoices/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(`./${quotation.signatureImage}`, invoiceImagePath);
    }

    try {
      let minQuanProducts = [];
      for (const item of quotation.items) {
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
      } else {
        const invoiceSettings = await invoiceSettingsModel.find().lean();

        const invoicerec = await invoiceModel.create(
          {
            invoiceNumber: `${invoiceSettings[0].invoicePrefix}${count
              .toString()
              .padStart(6, "0")}`,
            customerId: quotation.customerId,
            invoiceDate: quotation.quotation_date,
            dueDate: quotation.due_date,
            referenceNo: quotation.reference_no,
            items: quotation.items,
            discountType: quotation.discountType,
            discount: quotation.discount,
            tax: quotation.tax,
            taxableAmount: quotation.taxableAmount,
            totalDiscount: quotation.totalDiscount,
            vat: quotation.vat,
            roundOff: quotation.roundOff,
            TotalAmount: quotation.TotalAmount,
            bank: quotation.bank,
            notes: quotation.notes,
            termsAndCondition: quotation.termsAndCondition,
            signatureName: quotation.signature_name,
            signatureImage: invoiceImagePath,
            sign_type: quotation.sign_type,
            signatureId: quotation.signatureId ? quotation.signatureId : null,
            isRecurring: request.isRecurring,
            recurringCycle: request.recurringCycle ? request.recurringCycle : 0,
            userId: authUser.id,
            status: "DRAFTED",
            created_at: new Date(),
            isDeleted: false,
          },
          async function (err, invoiceDetails) {
            if (err) {
              data = { message: err.message };
              response.validation_error_message(data, res);
            } else {
              if (invoiceDetails) {
                await invoiceDetails.items.forEach(async (item) => {
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
                });
                data = {
                  message: "Quotation converted to invoice successfully.",
                };
                response.success_message(data, res);
              } else {
                data = { message: "Failed.", auth: true };
                response.error_message(data, res);
              }
            }
          }
        );
      }
    } catch (err) {
      console.log("error :", err);
      data = { message: err.message };
      response.validation_error_message(data, res);
    }
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};

//Clone Quotation
exports.cloneQuotation = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const originalQuotationId = req.body.id;
    const originalQuotation = await quotationModel.findById(
      originalQuotationId
    );
    if (originalQuotation.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(originalQuotation.signatureImage);
      const quotationImagePath = `./uploads/quotation/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(
        `./${originalQuotation.signatureImage}`,
        quotationImagePath
      );

      originalQuotation.signatureImage = quotationImagePath;
    }

    if (!originalQuotation) {
      return res.status(404).json({ error: "Original quotation not found" });
    }
    const qcount = await quotationModel.find({}).count();
    let count = qcount + 1;
    const clonedQuotation = new quotationModel(originalQuotation.toObject());
    clonedQuotation._id = mongoose.Types.ObjectId();
    clonedQuotation.isCloned = true;
    clonedQuotation.quotation_id = `QUO-${count.toString().padStart(6, "0")}`;
    const savedQuotation = await clonedQuotation.save();
    response.success_message(savedQuotation, res);
  } catch (error) {
    return res.status(500).json({ error: "Failed to clone quotation" });
  }
};

exports.getQuotationNumber = async (req, res) => {
  try {
    const creditNoteRecords = await quotationModel.find().count();
    const creditNoteNumber = `QUO-${(creditNoteRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(creditNoteNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
