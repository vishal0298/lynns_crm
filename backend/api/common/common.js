const verify = require("../../verify.token");
const rolesModel = require("../role/models/roles.model");
const response = require("../../response");
const multer = require("multer");
const moment = require("moment");

exports.Difference_In_Days = (start_Date, end_date) => {
  var Difference_In_Time =
    new Date(end_date).getTime() - new Date(start_Date).getTime();
  return Difference_In_Time / (1000 * 3600 * 24);
};

exports.imageUpload = (fileldName, path) => {
  try {
    const Storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path);
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    });

    return multer({ storage: Storage }).single(fileldName);
  } catch (error) {
    next(error);
  }
};
