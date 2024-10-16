const expenseModel = require("../models/expense.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const mongoose = require("mongoose");
const fs = require("fs");
const resUpdate = require("../../common/date");

var data;

exports.create = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;

    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const expenseCount = await expenseModel.find({}).count();
    const newCount = expenseCount + 1;
    const expenseRec = await expenseModel.create({
      expenseId: request.expenseId,
      reference: request.reference,
      amount: request.amount,
      paymentMode: request.paymentMode,
      description: request.description,
      expenseDate: request.expenseDate,
      status: request.status,
      attachment: filePath,
      userId: auth_user.id,
    });
    if (expenseRec) {
      data = {
        message: "Expense created successfully.",
        auth: true,
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

// exports.list = async (req, res) => {
//   try {
//     const auth_user = verify.verify_token(req.headers.token).details;
//     const request = req.query;
//     const expenseRecs = await expenseModel.find({
//       userId: auth_user.id,
//       isDeleted: false,
//     });
//     // .skip(request.skip)
//     // .limit(request.limit);
//     const expenseRecsCount = await expenseModel
//       .find({
//         userId: auth_user.id,
//         isDeleted: false,
//       })
//       .count();
//     expenseRecs.forEach((item) => {
//       item.attachment.forEach((att) => {
//         att.path = `${process.env.DEVLOPMENT_BACKEND_URL}/${att.path}`;
//       });
//     });
//     response.success_message(
//       {
//         expenseRecs: expenseRecs,
//         noOfRecs: expenseRecsCount,
//       },
//       res
//     );
//   } catch (error) {
//     console.log("error :", error);
//     response.error_message(error.message, res);
//   }
// };

exports.list = async (req, res) => {
  try {
    const request = req.query;
    let filter = {};
    filter.isDeleted = false;
    if (request.status) {
      filter.status = {
        $in: request.status.split(","),
      };
    }
    const expenseRecordsCount = await expenseModel.find(filter).count();
    const expenseRecs = await expenseModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(request.skip)
      .limit(request.limit)
      .lean();
    expenseRecs.forEach((item) => {
      if (
        item &&
        item.attachment.length !== 0 &&
        !item.attachment.includes("")
      ) {
        item.attachment = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.attachment}`;
      }

      item.createdAt = resUpdate.resDate(item.createdAt);
    });

    response.success_message(expenseRecs, res, expenseRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const expenseRec = await expenseModel.findById(req.params.id).lean();
    if (expenseRec) {
      if (
        expenseRec.attachment.length !== 0 &&
        !expenseRec.attachment.includes("")
      ) {
        expenseRec.attachment = `${process.env.DEVLOPMENT_BACKEND_URL}/${expenseRec.attachment[0]}`;
      }

      data = {
        expenseDetails: expenseRec,
      };
      response.success_message(data, res);
    } else {
      data = {
        expenseDetails: [],
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

    const exp_rec = await expenseModel.findById(req.params.id);
    let newImage = exp_rec.attachment;
    if (req.file) {
      newImage = req.file.path;
      if (exp_rec.attachment !== "" && fs.existsSync(exp_rec.attachment)) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, exp_rec.attachment);
        fs.unlinkSync(oldImagePath);
      }
    }
    let exDate = new Date(request.expenseDate);
    var newvalues = {
      $set: {
        expenseId: request.expenseId,
        reference: request.reference,
        amount: request.amount,
        paymentMode: request.paymentMode,
        expenseDate: request.expenseDate,
        status: request.status,
        description: request.description,
        attachment: newImage,
        userId: auth_user.id,
      },
    };
    const dublicaterec = await expenseModel.findOne({
      expenseId: request.expenseId,
      isDeleted: false,
      _id: { $ne: req.params.id },
    });

    if (dublicaterec) {
      data = { message: "expenseId Already Exists.." };
      response.validation_error_message(data, res);
    } else {
      const rcpt = await expenseModel.findByIdAndUpdate(
        req.params.id,
        newvalues
      );

      if (rcpt) {
        data = { message: "Expense updated successfully.." };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.delete = async (req, res) => {
  try {
    const expenseRec = await expenseModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
    if (expenseRec) {
      data = {
        message: "expense deleted successfully",
      };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.getExpenseNumber = async (req, res) => {
  try {
    const purchaseOrderRecords = await expenseModel.find().count();
    const purchaseOrderNumber = `EXP-${(purchaseOrderRecords + 1)
      .toString()
      .padStart(6, 0)}`;
    response.success_message(purchaseOrderNumber, res);
  } catch (error) {
    console.log("error:", error);
    response.error_message(error.message, res);
  }
};
