const manageUsersModel = require("../models/manage_users.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const fs = require("fs");
const resUpdate = require("../../common/date");
const usersModel = require("../../auth/models/auth.model");
const bcrypt = require("bcryptjs");
const path = require("path");
const mongoose = require("mongoose");

var data;

// exports.create = async (req, res) => {
//   var request = req.body;
//   const auth_user = verify.verify_token(req.headers.token).details;
//   let filePath = "";
//   if (req.files.length > 0) {
//     filePath = req.files[0].path;
//   }
//   usersModel.findOne(
//     {
//       user_id: auth_user.id,
//       $or: [{ email: request.email }, { mobileNumber: request.mobileNumber }],
//     },
//     function (err, userrec) {
//       if (err) {
//         data = { message: "Error on the server." };
//         response.error_message(data, res);
//       } else {
//         if (userrec) {
//           data = { message: "User Name or Phone Number Already Exists.." };
//           response.validation_error_message(data, res);
//         } else {
//           try {
//             const hashedPassword = bcrypt.hashSync(req.body.password, 8);
//             usersModel.create(
//               {
//                 firstName: request.firstName,
//                 lastName: request.lastName,
//                 fullname: request.fullName,
//                 DOB: request.DOB,
//                 userName: request.userName,
//                 email: request.email,
//                 mobileNumber: request.mobileNumber,
//                 role: request.role,
//                 password: hashedPassword,
//                 status: request.status,
//                 images: filePath,
//                 userId: auth_user.id,
//                 created_at: new Date(),
//               },
//               function (err, userrec) {
//                 if (err) {
//                   data = { message: err.message };
//                   response.validation_error_message(data, res);
//                 } else {
//                   if (userrec) {
//                     try {
//                       if (req.files.length > 0) {
//                         var req_files = [];
//                         var fileKeys = Object.keys(req.files);
//                         fileKeys.forEach(function (key) {
//                           req_files.push({
//                             path:
//                               "/uploads/manage_users/" +
//                               auth_user.id +
//                               "/" +
//                               userrec._id +
//                               "/" +
//                               req.files[key].filename.trim(),
//                             filename: req.files[key].filename,
//                           });
//                         });

//                         var newvalues = { $set: { images: req_files } };
//                         manageUsersModel.findByIdAndUpdate(
//                           { _id: userrec._id },
//                           newvalues,
//                           function (err, uprec) {
//                             if (err) console.log(err.message);
//                           }
//                         );

//                         fs.renameSync(
//                           "./uploads/manage_users/" +
//                             auth_user.id +
//                             "/" +
//                             userrec.name,
//                           "./uploads/manage_users/" +
//                             auth_user.id +
//                             "/" +
//                             userrec._id
//                         );
//                       }
//                       data = {
//                         message: "User Created successfully.",
//                         auth: true,
//                       };
//                       response.success_message(data, res);
//                     } catch (err) {
//                       data = { message: err.message };
//                       response.validation_error_message(data, res);
//                     }

//                     // data= {message: 'User Created successfully.' , auth : true };
//                     // response.success_message(data,res);
//                   }
//                 }
//               }
//             );
//           } catch (err) {
//             data = { message: err.message };
//             response.validation_error_message(data, res);
//           }
//         }
//       }
//     }
//   );
// };

exports.create = async (req, res) => {
  try {
    const request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    let filePath = "";
    if (req.files.length > 0) {
      filePath = req.files[0].path;
    }
    let orQuery = [{ email: request.email }];
    if (request.mobileNumber) {
      orQuery.push({ mobileNumber: request.mobileNumber });
    }
    const userRec = await usersModel.findOne({
      userId: auth_user.id,
      isDeleted: false,
      $or: orQuery,
    });
    if (userRec) {
      data = { message: ["Email or Phone Number Already Exists.."] };
      response.validation_error_message(data, res);
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const rec = await usersModel.create({
        firstName: request.firstName,
        lastName: request.lastName,
        userName: request.userName,
        fullname: request.fullname,
        email: request.email,
        role: request.role,
        mobileNumber: request.mobileNumber,
        gender: request.gender,
        DOB: request.DOB,
        password: hashedPassword,
        status: request.status,
        image: filePath,
        addressinformation: {
          address: request.address,
          country: request.country,
          city: request.city,
          state: request.state,
          postalcode: request.postalcode,
        },
        userId: auth_user.id,
        created_at: new Date(),
      });
      response.success_message({ message: "user added successfully" }, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

//Update users

exports.update = async (req, res) => {
  const auth_user = verify.verify_token(req.headers.token).details;
  const newRec = await usersModel.findById(req.params.id);
  var request = req.body;

  // if (auth_user.role === "Super Admin" || auth_user.role === "user" && newRec.role === "Super Admin") {
  //   data = { message: "You are not allowed to edit the Super Admin and user." };
  //   response.validation_error_message(data, res);
  //   return;
  // }

  if (newRec.role === "Super Admin") {
    const data = { message: "You are not allowed to edit the Super Admin." };
    response.validation_error_message(data, res);
    return;
  }

  let filePath = newRec.image;
  if (request.image == "remove") {
    filePath = "";
  }
  if (req.files.length > 0 || request.image == "remove") {
    if (newRec.image !== "" && fs.existsSync(newRec.image)) {
      const rootDir = path.resolve("./");
      let newImagePath = path.join(rootDir, newRec.image);
      fs.unlinkSync(newImagePath);
    }
  }
  if (req.files.length > 0) {
    filePath = req.files[0].path;
  }
  // const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var newvalues = {
    $set: {
      firstName: request.firstName,
      lastName: request.lastName,
      userName: request.userName,
      fullname: request.fullname,
      email: request.email,
      role: request.role,
      mobileNumber: request.mobileNumber,
      gender: request.gender,
      DOB: request.DOB,
      // password: hashedPassword,
      status: request.status,
      image: filePath,
      addressinformation: {
        address: request.address,
        country: request.country,
        city: request.city,
        state: request.state,
        postalcode: request.postalcode,
      },
      userId: auth_user.id,
      created_at: new Date(),
    },
  };
  let orQuery = [{ email: request.email }];

  if (request.mobileNumber) {
    orQuery.push({ mobileNumber: request.mobileNumber });
  }
  usersModel.findOne(
    {
      userId: auth_user.id,
      $or: orQuery,
      _id: { $ne: req.params.id },
      isDeleted: false,
    },
    async (err, dublicaterec) => {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (dublicaterec) {
          data = { message: "email or Phone Number Already Exists.." };
          response.validation_error_message(data, res);
        } else {
          usersModel.findByIdAndUpdate(
            req.params.id,
            newvalues,
            function (err, use) {
              if (err) {
                data = JSON.stringify({ message: err.message });
                response.validation_error_message(data, res);
              } else {
                if (use) {
                  data = { message: "User updated successfully." };
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

//View users

exports.view = function (req, res) {
  usersModel
    .findOne({ _id: req.params.id })
    .select("-__v -updated_at")
    .lean()
    .exec(function (err, manageuserinfo) {
      if (err) {
        data = { message: err._message };
        response.validation_error_message(data, res);
      } else {
        if (manageuserinfo) {
          if (manageuserinfo.image !== "") {
            manageuserinfo.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${manageuserinfo.image}`;
          }
          data = {
            user_details: manageuserinfo,
          };
          response.success_message(data, res);
        } else {
          data = {
            user_details: [],
            message: "No result found",
          };
          response.success_message(data, res);
        }
      }
    });
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    let filter = {
      isDeleted: false,
    };
    if (request.user) {
      let splittedVal = request.user.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter._id = { $in: splittedVal };
    }
    if (request.search_user) {
      filter.$or = [
        { userName: { $regex: `^${request.search_user}`, $options: 'i' } },
        { firstName: { $regex: `^${request.search_user}`, $options: 'i' } },
        { lastName: { $regex: `^${request.search_user}`, $options: 'i' } },
      ];
    }
    const userRecordsCount = await usersModel.find(filter).count();
    const userRec = await usersModel
      .find(filter)
      .lean()
      .skip(request.skip)
      .limit(request.limit)
      .sort({ _id: -1 });
    if (userRec.length > 0) {
      for (const item of userRec) {
        if (item.image !== "") {
          item.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.image}`;
          // item.createdAt = resUpdate.resDate(item.createdAt);
        }
      }
    }
    response.success_message(userRec, res, userRecordsCount);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const user_model = await usersModel.findOneAndUpdate(
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

//delete image

exports.delete_image = function (req, res) {
  manageUsersModel.updateOne(
    { _id: req.body.id },
    { $pull: { images: { id: req.body.image_id } } },
    function (err, results) {
      if (err) {
        data = { message: err.message };
        response.validation_error_message(data, res);
      } else {
        if (results) {
          var message =
            results.deletedCount > 0 ? "Deleted" : "Image Not Found";
          data = { message: message, modifiedCount: results.modifiedCount };
          response.success_message(data, res);
        }
      }
    }
  );
};
