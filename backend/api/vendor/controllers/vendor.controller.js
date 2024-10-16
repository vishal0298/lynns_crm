const vendorModel = require("../models/vendor.model");
const ledgerModel = require("../../ledger/models/ledger.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const resUpdate = require("../../common/date");
const mongoose = require("mongoose");
var data;

exports.create = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const vendorrec = await vendorModel.findOne({
      $and: [
        { vendor_email: request.vendor_email },
        { vendor_phone: request.vendor_phone },
      ],
    });
    const vendoremailrec = await vendorModel.findOne({
      vendor_email: request.vendor_email,
    });
    const vendorphnrec = await vendorModel.findOne({
      vendor_phone: request.vendor_phone,
    });

    if (vendorrec) {
      data = { message: "Vendor email and phone already exists.." };
      response.validation_error_message(data, res);
    } else if (vendoremailrec) {
      data = { message: "Vendor email already exists.." };
      response.validation_error_message(data, res);
    } else if (vendorphnrec) {
      data = { message: "Vendor phone number already exists.." };
      response.validation_error_message(data, res);
    } else {
      try {
        console.log("request.balanceType.length :", request.balanceType.length);
        const vendorrec = await vendorModel.create({
          vendor_name: request.vendor_name,

          vendor_email: request.vendor_email,
          vendor_phone: request.vendor_phone,
          balance: request.balance,
          balanceType: request.balanceType,
          user_id: auth_user.id,
          isDeleted: false,
          created_at: new Date(),
        });
        if (vendorrec) {
          data = {
            message: "Vendor Created successfully.",
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

exports.list = async function (req, res) {
  try {
    const request = req.query;
    let filter = {};
    filter.isDeleted = false;

    if (request.vendor) {
      let splittedVal = request.vendor.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter._id = { $in: splittedVal };
    }
    if (request.search_vendor) {
      filter.vendor_name = {
        $regex: `^${request.search_vendor}`,
        $options: "i",
      };
    }
    const vendorRecordsCount = await vendorModel.find(filter).count();
    const vendorRec = await vendorModel
      .find(filter)
      .skip(request.skip)
      .limit(request.limit)
      .sort({ _id: -1 })
      .lean();
    for (const item of vendorRec) {
      item.created_at = resUpdate.resDate(item.created_at);
      const ledgerAmount = await ledgerModel.aggregate([
        {
          $match: {
            vendorId: mongoose.Types.ObjectId(item._id),
          },
        },
        {
          $group: {
            _id: "$mode",
            amount: {
              $sum: "$amount",
            },
          },
        },
      ]);
      let creditAmount = 0;
      let debitAmount = 0;

      if (item.balanceType == "Credit") {
        creditAmount += item.balance;
      } else if (item.balanceType == "Debit") {
        debitAmount += item.balance;
      }
      for (const item of ledgerAmount) {
        item._id == "Credit"
          ? (creditAmount += item.amount)
          : (debitAmount += item.amount);
      }
      item.balance = creditAmount - debitAmount;
    }

    response.success_message(vendorRec, res, vendorRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const vendorinfo = await vendorModel
      .findOne({ _id: req.params.id })
      .select("-__v -updated_at");

    if (vendorinfo) {
      data = {
        vendor_details: vendorinfo,
      };
      response.success_message(vendorinfo, res);
    } else {
      data = {
        vendor_details: [],
        message: "No result found",
      };
      data.createdAt = resUpdate.resDate(data.createdAt);
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    var request = req.body;
    var newvalues = {
      $set: {
        vendor_name: request.vendor_name,
        vendor_email: request.vendor_email,
        vendor_phone: request.vendor_phone,
        balance: request.balance,
        balanceType: request.balanceType,
      },
    };

    const dublicaterec = await vendorModel.findOne({
      $and: [
        { vendor_email: request.vendor_email },
        { vendor_phone: request.vendor_phone },
      ],
      _id: { $ne: req.params.id },
    });
    const duplicateemail = await vendorModel.findOne({
      vendor_email: request.vendor_email,
      _id: { $ne: req.params.id },
    });
    const duplicatephn = await vendorModel.findOne({
      vendor_phone: request.vendor_phone,
      _id: { $ne: req.params.id },
    });

    if (dublicaterec) {
      data = { message: "Vendor email and phone already exists.." };
      response.validation_error_message(data, res);
    } else if (duplicateemail) {
      data = { message: "Vendor email already exists.." };
      response.validation_error_message(data, res);
    } else if (duplicatephn) {
      data = { message: "Vendor phone number already exists.." };
      response.validation_error_message(data, res);
    } else {
      const vendorec = await vendorModel.findByIdAndUpdate(
        req.params.id,
        newvalues
      );
      if (vendorec) {
        data = { message: "vendor updated successfully." };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const vendor = await vendorModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );
    data = { message: "Deleted Successfully", deletedCount: 1 };
    response.success_message(data, res);
  } catch (error) {
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};
