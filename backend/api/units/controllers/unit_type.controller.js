const unit_typeModel = require("../models/unit_type.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const mongoose = require("mongoose");
const objectId = new mongoose.Types.ObjectId();
//const numericalId = parseInt(objectId.valueOf().toString(), 16);

var data;

exports.create = async function (req, res) {
  var request = req.body;
  const auth_user = verify.verify_token(req.headers.token).details;
  const name = request.name.trim().toLowerCase();
  unit_typeModel.findOne(
    {
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isDeleted: false,
    },
    function (err, unittype) {
      if (err) {
        data = { message: "Error on the server." };
        response.error_message(data, res);
      } else {
        if (unittype) {
          data = { message: "Unit type already exists." };
          response.validation_error_message(data, res);
        } else {
          try {
            unit_typeModel.create(
              {
                id: new mongoose.Types.ObjectId(),
                name: request.name,
                symbol: request.symbol,
                //  parent_unit: request.parent_unit,
                user_id: auth_user.id,
                created_at: new Date(),
              },
              function (err, unittype) {
                if (err) {
                  data = { message: err.message };
                  response.validation_error_message(data, res);
                } else {
                  if (unittype) {
                    data = {
                      message: "Unit Type Created successfully.",
                      auth: true,
                    };
                    response.success_message(data, res);
                  } else {
                    data = { message: "Failed.", auth: true };
                    response.error_message(data, res);
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

exports.list = async function (req, res) {
  var filter = {};
  const request = req.query;

  filter.isDeleted = false;
  if (request.unit) {
    let splittedVal = request.unit.split(",").map((id) => {
      return mongoose.Types.ObjectId(id);
    });
    filter._id = { $in: splittedVal };
  }
  if (request.search_unit) {
    filter.name = {
      $regex: `^${request.search_unit}`,
      $options: "i",
    };
  }
  const unitRecordsCount = await unit_typeModel.find(filter).count();
  const unit_typeRec = await unit_typeModel
    .find(filter)
    .sort({ _id: -1 })
    .skip(request.skip)
    .limit(request.limit);
  response.success_message(unit_typeRec, res, unitRecordsCount);
};

exports.view = function (req, res) {
  unit_typeModel
    .findOne({ _id: req.params.id })
    .select("-__v -updated_at")
    .exec(function (err, unit_type) {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (unit_type) {
          data = {
            unit_type_details: unit_type,
          };
          response.success_message(unit_type, res);
        } else {
          data = {
            unit_type_details: [],
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
      symbol: request.symbol,
      // parent_unit: request.parent_unit,
    },
  };

  const name = request.name.trim().toLowerCase();
  unit_typeModel.findOne(
    {
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: req.params.id },
      user_id: auth_user.id,
    },
    async (err, dublicaterec) => {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (dublicaterec) {
          data = { message: "Unit type already exists." };
          response.validation_error_message(data, res);
        } else {
          unit_typeModel.findByIdAndUpdate(
            req.params.id,
            newvalues,
            function (err, unit_type) {
              if (err) {
                data = JSON.stringify({ message: err.message });
                response.validation_error_message(data, res);
              } else {
                if (unit_type) {
                  data = { message: "Unit Type updated successfully." };
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

exports.delete = function (req, res) {
  unit_typeModel.deleteOne({ _id: req.params.id }, function (err, results) {
    if (err) {
      data = { message: err.message };
      response.validation_error_message(data, res);
    } else {
      if (results) {
        var message =
          results.deletedCount > 0
            ? "Deleted Successfully"
            : "Record Not Found";
        data = { message: message, deletedCount: results.deletedCount };
        response.success_message(data, res);
      }
    }
  });
};

exports.softDelete = async (req, res) => {
  try {
    const purchaseOrder = await unit_typeModel.findOneAndUpdate(
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
