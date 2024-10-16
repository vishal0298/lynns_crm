const taxModel = require("../models/tax.model.js");
const response = require("../../../response");
const verify = require("../../../verify.token");
const fs = require("fs");

var data;

exports.create = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const name = request.name.trim().toLowerCase();
    const dublicateRec = await taxModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isDeleted: false,
    });
    if (dublicateRec) {
      data = { message: "Tax name already exists." };
      response.validation_error_message(data, res);
    } else {
      const taxRec = await taxModel.create({
        name: request.name,
        taxRate: request.taxRate,
        type: request.type,
        status: request.status,
        userId: auth_user.id,
      });
      data = { message: "Tax Created successfully.", auth: true };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const taxRecs = await taxModel
      .find({
        isDeleted: false,
      })
      .skip(req.query.skip)
      .limit(req.query.limit)
      .lean();
    const taxRecordsCount = await taxModel
      .find({
        isDeleted: false,
      })
      .count();

    taxRecs.forEach((item) => {
      item.id = item._id;
      item.text = item.name;
    });
    response.success_message(taxRecs, res, taxRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.view = async (req, res) => {
  try {
    const taxRec = await taxModel.findOne({ _id: req.params.id });
    response.success_message(taxRec, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const name = request.name.trim().toLowerCase();

    const duplicateRec = await taxModel.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (duplicateRec) {
      response.validation_error_message(
        {
          message: ["Tax name already exists."],
        },
        res
      );
    } else {
      let newvalues = {
        $set: {
          name: request.name,
          taxRate: request.taxRate,
          type: request.type,
          status: request.status,
        },
      };

      const tax = await taxModel.findByIdAndUpdate(req.params.id, newvalues);

      if (tax) {
        data = { message: "Tax updated successfully." };
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
    const taxRec = await taxModel.findByIdAndUpdate(req.body._id, {
      $set: {
        isDeleted: true,
      },
    });

    data = { message: "Tax deleted successfully" };
    response.success_message(data, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
