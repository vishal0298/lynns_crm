const response = require("../../../response");
const verify = require("../../../verify.token");
const bankSettingModel = require("../models/bankSettings.model");

exports.addBank = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const bankName = request.bankName.trim().toLowerCase();
    const dublicateRec = await bankSettingModel.findOne({
      bankName: { $regex: new RegExp(`^${bankName}$`, "i") },
      accountNumber: request.accountNumber,
      userId: authUser.id,
      isDeleted: false,
    });
    if (dublicateRec) {
      data = { message: "Bank account already exists." };
      response.validation_error_message(data, res);
    } else {
      const bankRec = await bankSettingModel.create({
        name: request.name,
        bankName: request.bankName,
        branch: request.branch,
        accountNumber: request.accountNumber,
        IFSCCode: request.IFSCCode,
        userId: authUser.id,
      });
      data = { message: "bank Created successfully.", auth: true };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.updateBank = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const bankName = request.bankName.trim().toLowerCase();

    const duplicateRec = await bankSettingModel.findOne({
      _id: { $ne: request._id },
      bankName: { $regex: new RegExp(`^${bankName}$`, "i") },
      accountNumber: request.accountNumber,
      isDeleted: false,
    });

    if (duplicateRec) {
      data = { message: "Bank account already exists." };
      response.validation_error_message(data, res);
    } else {
      let newvalues = {
        $set: {
          name: request.name,
          bankName: request.bankName,
          branch: request.branch,
          accountNumber: request.accountNumber,
          IFSCCode: request.IFSCCode,
        },
      };

      const bankRec = await bankSettingModel.findByIdAndUpdate(
        request._id,
        newvalues
      );

      if (bankRec) {
        const data = { message: "Bank updated successfully.", auth: true };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.listBank = async (req, res) => {
  try {
    const request = req.query;
    const bankRec = await bankSettingModel
      .find({
        isDeleted: false,
      })
      .skip(request.skip)
      .limit(request.limit)
      .lean();
    const bankRecordsCount = await bankSettingModel
      .find({
        isDeleted: false,
      })
      .count();
    bankRec.forEach((item) => {
      item.id = item._id;
      item.text = item.name;
    });
    response.success_message(bankRec, res, bankRecordsCount);
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.viewBank = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const bankRec = await bankSettingModel.findById(req.params.id);
    response.success_message(bankRec, res);
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.deleteBank = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const bankRec = await bankSettingModel.findByIdAndUpdate(request._id, {
      $set: {
        isDeleted: true,
      },
    });
    if (bankRec) {
      const data = { message: "bank deleted successfully" };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};
