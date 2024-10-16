const ledgerModel = require("../models/ledger.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const mongoose = require("mongoose");
const resUpdate = require("../../common/date");
const vendorModel = require("../../vendor/models/vendor.model");

let data;

exports.create = async (req, res) => {
  let request = req.body;
  const auth_user = verify.verify_token(req.headers.token).details;
  ledgerModel.findOne(
    {
      name: request.name,
      date: request.date,
      reference: request.reference,
      mode: request.mode,
    },
    (err, ledger) => {
      if (err) {
        data = { message: "Error on the server." };
        response.error_message(data, res);
      } else {
        if (ledger) {
          data = { message: "Ledger is already been added" };
          response.validation_error_message(data, res);
        } else {
          try {
            ledgerModel.create(
              {
                name: request.name,
                date: request.date,
                reference: request.reference,
                mode: request.mode,
                vendorId: request.vendorId,
                amount: Number(request.amount),
                user_id: auth_user.id,
                isDeleted: false,
                created_at: new Date(),
              },
              (err, ledger) => {
                if (err) {
                  data = { message: err.message };
                  response.validation_error_message(data, res);
                } else {
                  if (ledger) {
                    data = {
                      message: "Ledger has been Created Successfully",
                      auth: true,
                    };
                    response.success_message(data, res);
                  } else {
                    data = { message: "Failed.", auth: true };
                    response.error + message(data, res);
                  }
                }
              }
            );
          } catch (err) {
            data = { message: err.message };
            response.validation_error_message(data, res);
          }
        }
      }
    }
  );
};

exports.list = async (req, res) => {
  // const auth_user = verify.verify_token(req.headers.token).details;
  const ledgerData = await ledgerModel.find({ vendorId: req.query.vendorId });
  var optionsData = {};
  optionsData.select = "-__v -updated_at";
  optionsData.sort = { _id: -1 };
  optionsData.lean = true;
  var filter = { vendorId: req.query.vendorId };
  filter.isDeleted = false;

  filter.ledger = req.query.ledger;

  let ledgerRecordsCount = await ledgerModel.paginate(filter, optionsData);
  const vendorRecord = await vendorModel.findById(req.query.vendorId).lean();

  let finalClosingBalance = 0;
  vendorRecord.balanceType == "Credit"
    ? (finalClosingBalance += vendorRecord.balance)
    : (finalClosingBalance -= vendorRecord.balance);

  for (const ledgerRecord of ledgerRecordsCount.docs) {
    ledgerRecord.mode == "Credit"
      ? (finalClosingBalance += ledgerRecord.amount)
      : (finalClosingBalance -= ledgerRecord.amount);
  }
  console.log("finalClosingBalance :", finalClosingBalance);
  ledgerRecordsCount = ledgerRecordsCount.totalDocs;
  if (req.query.skip) {
    optionsData.offset = parseInt(req.query.skip);
  }
  if (req.query.limit) {
    optionsData.limit = parseInt(req.query.limit);
  }

  if (req.query.keyword) filter.ledger = { $regex: req.query.keyword };
  ledgerModel.paginate(filter, optionsData).then(async (result) => {
    if (result.docs.length > 0) {
      for (const item of result.docs) {
        const ledgerBalance = await ledgerModel.aggregate([
          {
            $match: {
              vendorId: mongoose.Types.ObjectId(item.vendorId),
              created_at: { $lte: item.created_at },
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
        if (vendorRecord.balanceType == "Credit") {
          creditAmount += vendorRecord.balance;
        } else {
          debitAmount += vendorRecord.balance;
        }
        for (const item of ledgerBalance) {
          item._id == "Credit"
            ? (creditAmount += item.amount)
            : (debitAmount += item.amount);
        }
        item.closingBalance = creditAmount - debitAmount;
        item.date = resUpdate.resDate(item.date);
      }
    }

    response.success_message(
      { ledgers: result.docs, finalClosingBalance: finalClosingBalance },
      res,
      ledgerRecordsCount
    );
  });
};

exports.view = (req, res) => {
  ledgerModel
    .findOne({ _id: req.params.id })
    .select("-__v -updated_at")
    .exec((err, ledger) => {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (ledger) {
          data = {
            ledger_details: ledger,
          };
          response.success_message(data, res);
        } else {
          data = {
            ledger_details: [],
            message: "No result found",
          };
          response.success_message(data, res);
        }
      }
    });
};

exports.update = function (req, res) {
  const auth_user = verify.verify_token(req.headers.token).details;
  var request = req.body;
  var newvalues = {
    $set: {
      name: request.name,
      date: request.date,
      reference: request.reference,
      vendorId: request.vendorId,
      amount: Number(request.amount),
      mode: request.mode,
    },
  };

  ledgerModel.findOne(
    {
      name: request.name,
      date: request.date,
      reference: request.reference,
      //  vendor_id: request.vendor_id,
      mode: request.mode,
      _id: { $ne: req.params.id },
      user_id: auth_user.id,
    },
    async (err, dublicaterec) => {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (dublicaterec) {
          data = { message: "Ledger Already Exists.." };
          response.validation_error_message(data, res);
        } else {
          ledgerModel.findByIdAndUpdate(
            req.params.id,
            newvalues,
            function (err, ledger) {
              if (err) {
                data = JSON.stringify({ message: err.message });
                response.validation_error_message(data, res);
              } else {
                if (ledger) {
                  data = { message: "Ledger updated successfully." };
                  response.success_message(data, res);
                }
              }
            }
          );
        }
      }
    }
  );
};

exports.softDelete = async (req, res) => {
  try {
    const ledger = await ledgerModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } }
    );
    data = { message: "Deleted Successfully", deletedCount: 1 };
    response.success_message(data, res);
  } catch (error) {
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};
