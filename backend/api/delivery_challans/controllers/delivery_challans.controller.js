const deliverychallanModel = require("../models/delivery_challans.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const path = require("path");
const fs = require("fs");
const invoiceModel = require("../../invoice/models/invoice.model");
const invoiceSettingsModel = require("../../invoiceSettings/models/invoiceSettings.model");
const resUpdate = require("../../common/date");
const mongoose = require("mongoose");
const inventoryModel = require("../../inventory/models/inventory.model");
const paymentModel = require("../../payment/models/payment.model");

var data;

exports.create = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const dcrec = await deliverychallanModel.findOne({
      deliveryChallanNumber: request.deliveryChallanNumber,
      isDeleted: false,
    });

    const dcCount = await deliverychallanModel.find({}).count();
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    let count = dcCount + 1;

    if (dcrec) {
      data = { message: "deliveryChallanNumber Alredy Used" };
      response.validation_error_message(data, res);
    } else {
      try {
        const dcrec = await deliverychallanModel.create({
          deliveryChallanNumber: request.deliveryChallanNumber,
          customerId: request.customerId,
          deliveryChallanDate: request.deliveryChallanDate,
          dueDate: request.dueDate,
          referenceNo: request.referenceNo,
          deliveryAddress: {
            name: request.deliveryAddress?.name,
            addressLine1: request.deliveryAddress?.addressLine1,
            addressLine2: request.deliveryAddress?.addressLine2,
            city: request.deliveryAddress?.city,
            state: request.deliveryAddress?.state,
            pincode: request.deliveryAddress?.pincode,
            country: request.deliveryAddress?.country,
          },
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
          userId: auth_user.id,
        });
        if (dcrec) {
          data = {
            message: "Delivery challan Created successfully.",
            auth: true,
          };
          response.success_message(data, res);
        }
      } catch (err) {
        data = { message: err.message };
        response.validation_error_message(data, res);
      }
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

    if (request.customer) {
      let splittedVal = request.customer.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter.customerId = { $in: splittedVal };
    }

    const deliveryChallanRecordsCount = await deliverychallanModel
      .find(filter)
      .count();
    const deliveryChallanRecs = await deliverychallanModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(request.skip)
      .limit(request.limit)
      .populate("customerId")
      .populate({ path: "signatureId" })
      .lean();

    for (const item of deliveryChallanRecs) {
      if (
        item.customerId &&
        item.customerId.image &&
        !item.customerId.image.startsWith("http")
      ) {
        item.customerId.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.customerId.image}`;
      }
      if (item.signatureImage) {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
      if (item.signatureInfo && item.signatureInfo.signatureImage) {
        item.signatureInfo.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureInfo.signatureImage}`;
      }
    }
    response.success_message(
      deliveryChallanRecs,
      res,
      deliveryChallanRecordsCount
    );
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const dcinfo = await deliverychallanModel
      .findOne({ _id: req.params.id })
      .populate({ path: "customerId", select: "-id -updated_at -__v" })
      .populate({ path: "signatureId" })
      .select("-__v -updated_at");
    if (dcinfo) {
      if (dcinfo.signatureImage) {
        dcinfo.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${dcinfo.signatureImage}`;
      }
      if (dcinfo.signatureInfo) {
        dcinfo.signatureInfo.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${dcinfo.signatureInfo.signatureImage}`;
      }
      // dcinfo.customerId.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${dcinfo.customerId.image}`;
      data = {
        dc_details: dcinfo,
      };

      response.success_message(data, res);
    } else {
      data = {
        dc_details: [],
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
    const auth_user = verify.verify_token(req.headers.token).details;
    var request = req.body;

    const imageRec = await deliverychallanModel.findById(req.params.id);
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
    var newvalues = {
      $set: {
        deliveryChallanNumber: request.deliveryChallanNumber,
        customerId: request.customerId,
        deliveryChallanDate: request.deliveryChallanDate,
        dueDate: request.dueDate,
        referenceNo: request.referenceNo,
        deliveryAddress: {
          name: request.deliveryAddress?.name,
          addressLine1: request.deliveryAddress?.addressLine1,
          addressLine2: request.deliveryAddress?.addressLine2,
          city: request.deliveryAddress?.city,
          state: request.deliveryAddress?.state,
          pincode: request.deliveryAddress?.pincode,
          country: request.deliveryAddress?.country,
        },
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
        signatureImage: request.sign_type === "eSignature" ? filePath : null,
        userId: auth_user.id,
      },
    };
    // const dublicaterec = await deliverychallanModel.findOne({
    //   deliveryChallanNumber: request.deliveryChallanNumber,
    //   _id: { $ne: req.body._id },
    // });

    // if (dublicaterec) {
    //   data = { message: "Delivery challan number Already Exists.." };
    //   response.validation_error_message(data, res);
    // } else {
    const dc = await deliverychallanModel.findByIdAndUpdate(
      req.params.id,
      newvalues
    );

    if (dc) {
      data = {
        message: "Delivery challan updated successfully.",
      };
      response.success_message(data, res);
    }
    // }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.delete = async (req, res) => {
  try {
    const query = {
      isDeleted: true,
    };
    const delivery_challan_rec = await deliverychallanModel.findByIdAndUpdate(
      req.body._id,
      query,
      { new: true }
    );
    if (delivery_challan_rec) {
      data = {
        message: "delivery challan deleted successfully",
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
  // deliverychallanModel.deleteOne(
  //   { _id: req.params.id },
  //   function (err, results) {
  //     if (err) {
  //       data = { message: err.message };
  //       response.validation_error_message(data, res);
  //     } else {
  //       if (results) {
  //         var message =
  //           results.deletedCount > 0
  //             ? "Deleted Successfully"
  //             : "Record Not Found";
  //         data = { message: message, deletedCount: results.deletedCount };
  //         response.success_message(data, res);
  //       }
  //     }
  //   }
  // );
};

exports.convertToInvoice = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;

    const invoiceModelcount = await invoiceModel.find().count();
    let count = invoiceModelcount + 1;

    // Retrieve the deliveryChallan to be converted
    const deliveryChallan = await deliverychallanModel.findById(request._id);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(deliveryChallan.signatureImage);
    const invoiceImagePath = `./uploads/invoices/signatureImage-${
      uniqueSuffix + ext
    }`;
    fs.copyFileSync(`./${deliveryChallan.signatureImage}`, invoiceImagePath);

    try {
      let minQuanProducts = [];
      for (const item of deliveryChallan.items) {
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
            customerId: deliveryChallan.customerId,
            invoiceDate: deliveryChallan.deliveryChallanDate,
            dueDate: deliveryChallan.dueDate,
            referenceNo: deliveryChallan.referenceNo,
            items: deliveryChallan.items,
            discountType: deliveryChallan.discountType,
            discount: deliveryChallan.discount,
            tax: deliveryChallan.tax,
            taxableAmount: deliveryChallan.taxableAmount,
            totalDiscount: deliveryChallan.totalDiscount,
            vat: deliveryChallan.vat,
            roundOff: deliveryChallan.roundOff,
            TotalAmount: deliveryChallan.TotalAmount,
            bank: deliveryChallan.bank,
            notes: deliveryChallan.notes,
            termsAndCondition: deliveryChallan.termsAndCondition,
            signatureName: deliveryChallan.signatureName,
            signatureImage: invoiceImagePath,
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
                  message:
                    "Delivery challan converted to invoice successfully.",
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
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.cloneDeliveryChallans = async function (req, res) {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const originaldcId = req.params.id;
    const originaldc = await deliverychallanModel.findById(originaldcId);
    if (originaldc.sign_type == "eSignature") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(originaldc.signatureImage);
      const deliveryChallanImagePath = `./uploads/delivery_challans/signatureImage-${
        uniqueSuffix + ext
      }`;
      fs.copyFileSync(
        `./${originaldc.signatureImage}`,
        deliveryChallanImagePath
      );

      originaldc.signatureImage = deliveryChallanImagePath;
    }

    if (!originaldc) {
      return response.data_error_message("DeliveryChallan id not found", res);
    }
    let minQuanProducts = [];
    for (const item of originaldc.items) {
      const dcRec = await deliverychallanModel.findOne({
        productId: item.productId,
      });
      if (dcRec.quantity < parseInt(item.quantity)) {
        minQuanProducts.push(
          `${item.name} has only ${dcRec.quantity} quantity`
        );
      }
    }
    if (minQuanProducts.length > 0) {
      response.validation_error_message({ message: minQuanProducts }, res);
    } else {
      const deliveryChallanModelCount =
        await deliverychallanModel.countDocuments({});
      let count = deliveryChallanModelCount + 1;

      // const invoiceSettings = await invoiceSettingsModel.find().lean();
      const clonedDeliverychallan = new deliverychallanModel(
        originaldc.toObject()
      );
      clonedDeliverychallan._id = mongoose.Types.ObjectId();
      clonedDeliverychallan.status = "DRAFTED";
      clonedDeliverychallan.isCloned = true;
      clonedDeliverychallan.deliveryChallanNumber = `DC-${count
        .toString()
        .padStart(6, "0")}`;

      clonedDeliverychallan.customerId = originaldc.customerId;

      const savedInvoice = await clonedDeliverychallan.save();
      if (savedInvoice) {
        const dcRec = await deliverychallanModel
          .findById(savedInvoice._id)
          .populate("customerId")
          .lean();
        for (const item of savedInvoice.items) {
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
        const paymentDetails = await paymentModel.aggregate([
          {
            $match: {
              invoiceId: mongoose.Types.ObjectId(savedInvoice._id),
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
        if (paymentDetails.length > 0) {
          dcRec.balance =
            parseFloat(dcRec.TotalAmount) - paymentDetails[0].paidAmount;
          dcRec.paidAmount = paymentDetails[0].paidAmount;
        } else {
          dcRec.balance = dcRec.TotalAmount;
          dcRec.paidAmount = 0;
        }
        if (dcRec.signatureImage) {
          dcRec.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${dcRec.signatureImage}`;
        }
        dcRec.deliveryChallanDate = resUpdate.resDate(
          dcRec.deliveryChallanDate
        );

        return response.success_message(dcRec, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.getDeliveryChallanNumber = async (req, res) => {
  try {
    const creditNoteRecords = await deliverychallanModel.find().count();
    const creditNoteNumber = `DC-${(creditNoteRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(creditNoteNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
