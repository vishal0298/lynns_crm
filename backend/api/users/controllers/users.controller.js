const authModel = require("../../auth/models/auth.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

var data;

exports.user_profile = function (req, res) {
  const auth_user = verify.verify_token(req.headers.token).details;
  authModel
    .findOne({ _id: auth_user.id })
    .select("-__v -updated_at -password -pswd_reset_at")
    .exec(function (err, userinfo) {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (userinfo) {
          if (userinfo.image !== "") {
            userinfo.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${userinfo.image}`;
          }
          data = {
            users_details: userinfo,
          };
          response.success_message(userinfo, res);
        } else {
          data = {
            users_details: [],
            message: "No result found",
          };
          response.success_message(data, res);
        }
      }
    });
};

exports.deleteRequest = async (req, res) => {
  try {
    const userRec = await authModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: { requestForDelete: true, deleteRequestDate: new Date() },
      },
      { new: true }
    );
    response.success_message(userRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userRec = await authModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: { isDeleted: true },
      },
      { new: true }
    );
    response.success_message(userRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.listdeleteReq = async (req, res) => {
  try {
    const userRec = await authModel.find({
      requestForDelete: true,
    });
    response.success_message(userRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const imageRec = await authModel.findById(auth_user.id);
    let imagePath;
    if (req.file == undefined) {
      imagePath = imageRec.image;
    } else {
      imagePath = req.file.path;
    }
    const newValues = {
      $set: {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        mobileNumber: request.mobileNumber,
        gender: request.gender,
        DOB: request.DOB,
        image: imagePath,
        // addressInformation: {
        //   address: request.addressInformation.address,
        //   country: request.addressInformation.country,
        //   state: request.addressInformation.state,
        //   city: request.addressInformation.city,
        //   postalcode: request.addressInformation.postalcode,
        // },
      },
    };
    if (req.file) {
      if (imageRec.image !== "" && fs.existsSync(imageRec.image)) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, imageRec.image);
        fs.unlinkSync(oldImagePath);
      }
    }
    const authRec = await authModel.findByIdAndUpdate(auth_user.id, newValues, {
      new: true,
    });

    let data = {
      message: "profile updated successfully",
      updatedData: authRec,
    };
    if (authRec.image) {
      authRec.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${authRec.image}`;
    }
    response.success_message(data, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.filterByFullName = async (req, res) => {
  try {
    let filter = {};

    if (req.body.userName && Array.isArray(req.body.userName)) {
      filter.userName = { $in: req.body.userName };
    }

    const userRec = await authModel.find(filter);

    response.success_message(userRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
