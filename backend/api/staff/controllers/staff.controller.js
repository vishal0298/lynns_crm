const staffModel = require("../models/staff.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const mongoose = require("mongoose");

// Create Staff
exports.create = async function (req, res) {
  try {
    const request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const staffName = request.name?.trim().toLowerCase();

    console.log(auth_user)
    // Check if staff member already exists
    const existingStaff = await staffModel.findOne({
      staffName: { $regex: new RegExp(`^${staffName}$`, "i") },
      isDeleted: false,
    });

    // console.log(existingStaff)

    if (existingStaff) {
      const data = { message: "Staff member already exists." };
      return response.validation_error_message(data, res);
    }

    // console.log(request.name)
    // console.log(request.employeeId)
    // console.log(request.mobileNumber)


    const newStaff = await staffModel.create({
      id: new mongoose.Types.ObjectId(),
      staffName: request?.name,
      employeeId: request?.employeeId,
      mobileNumber: request?.mobileNumber,
      user_id: auth_user.id,
      // isDeleted: false,
    })

    const data = {
      message: "Staff member created successfully.",
      auth: true,
    };
    response.success_message(data, res);
  } catch (err) {
    const data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// List Staff
exports.list = async function (req, res) {
  try {
    const filter = { isDeleted: false };
    // console.log(req)
    const request = req.query;
    console.log(request.search_staff)
    if (request.search_staff) {
      const splittedVal = request.staff?.split(",").map((id) => mongoose.Types.ObjectId(id));
      filter._id = { $in: splittedVal };
    }
    if (request.search_staff) {
      filter.staffName = { $regex: `^${request.search_staff}`, $options: "i" };
    }

    const staffRecordsCount = await staffModel.countDocuments(filter);
    // console.log(staffRecordsCount)

    const staffRec = await staffModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(Number(request.skip))
      .limit(Number(request.limit));


      // console.log(staffRec)

    response.success_message(staffRec, res, staffRecordsCount);
  } catch (err) {
    const data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// View Staff
exports.view = async function (req, res) {
  console.log(req)
  try {
    const staff = await staffModel
      .findOne({ _id: req.params.id })
      .select("-__v -updated_at");

    if (staff) {
      const data = { staff_details: staff };
      response.success_message(data, res);
    } else {
      const data = { staff_details: [], message: "No result found" };
      response.success_message(data, res);
    }
  } catch (err) {
    const data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// Update Staff
exports.update = async function (req, res) {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;
    const staffName = request.name.trim().toLowerCase();

    // Check if staff member with the same name already exists
    const duplicateRec = await staffModel.findOne({
      staffName: { $regex: new RegExp(`^${staffName}$`, "i") },
      _id: { $ne: req.params.id },
      user_id: auth_user.id,
    });

    if (duplicateRec) {
      const data = { message: "Staff member already exists." };
      return response.validation_error_message(data, res);
    }

    const newValues = {
      $set: {
        staffName: request.name,
        employeeId: request.employeeId,
        mobileNumber: request.mobileNumber,
      },
    };

    const staff = await staffModel.findByIdAndUpdate(req.params.id, newValues, { new: true });

    if (staff) {
      const data = { message: "Staff member updated successfully." };
      response.success_message(data, res);
    } else {
      const data = { message: "Staff member not found." };
      response.validation_error_message(data, res);
    }
  } catch (err) {
    const data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// Delete Staff
exports.delete = async function (req, res) {
  try {
    const results = await staffModel.deleteOne({ _id: req.params.id });

    if (results.deletedCount > 0) {
      const data = { message: "Deleted Successfully", deletedCount: results.deletedCount };
      response.success_message(data, res);
    } else {
      const data = { message: "Record Not Found", deletedCount: results.deletedCount };
      response.success_message(data, res);
    }
  } catch (err) {
    const data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

// Soft Delete Staff
exports.softDelete = async function (req, res) {
  try {
    const staff = await staffModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    const data = {
      message: staff ? "Deleted Successfully" : "Record Not Found",
      deletedCount: staff ? 1 : 0,
    };
    response.success_message(data, res);
  } catch (error) {
    const data = { message: error.message };
    response.validation_error_message(data, res);
  }
};



// can you please look in to it and figure out what's wrong here and fix it without braking flow 

// SCHEMA_MODEL:

// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");
// const Schema = mongoose.Schema;

// let staffSchema = new Schema({
//   name: { type: String, required: true }, // Staff Name
//   employeeId: { type: String, required: true }, // Employee ID
//   mobileNumber: { type: String, required: true }, // Mobile Number
//   user_id: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   // `created_at` and `updated_at` will be managed by Mongoose's timestamps option
//   isDeleted: { type: Boolean, default: false },
// }, { timestamps: true }); // Automatically handles `created_at` and `updated_at`

// staffSchema.plugin(mongoosePaginate);

// // Export the model
// module.exports = mongoose.model("staff", staffSchema);


// CONTROLLER:

// const staffModel = require("../models/staff.model");
// const response = require("../../../response");
// const verify = require("../../../verify.token");
// const mongoose = require("mongoose");

// // Create Staff
// exports.create = async function (req, res) {
//   try {
//     const request = req.body;
//     const auth_user = verify.verify_token(req.headers.token).details;
//     const staffName = request.name?.trim().toLowerCase();

//     console.log(auth_user)
//     // Check if staff member already exists
//     const existingStaff = await staffModel.findOne({
//       staffName: { $regex: new RegExp(`^${staffName}$`, "i") },
//       isDeleted: false,
//     });

//     // console.log(existingStaff)

//     if (existingStaff) {
//       const data = { message: "Staff member already exists." };
//       return response.validation_error_message(data, res);
//     }

//     console.log(request.name)
//     console.log(request.employeeId)
//     console.log(request.mobileNumber)


//     const newStaff = await staffModel.insertOne({
//       id: new mongoose.Types.ObjectId(),
//       staffName: request.name,
//       employeeId: request.employeeId,
//       mobileNumber: request.mobileNumber,
//       user_id: auth_user.id,
//       // isDeleted: false,
//     })
//     // Create new staff member
//     // const newStaff = await staffModel.create({
//     //   id: new mongoose.Types.ObjectId(),
//     //   staffName: request.name,
//     //   employeeId: request.employeeId,
//     //   mobileNumber: request.mobileNumber,
//     //   user_id: auth_user.id,
//     //   isDeleted: false,
//     //   // created_at: new Date(),
//     // });

//     console.log("helloooooooooooo" )
//     console.log("newStaff :" + newStaff )

//     const data = {
//       message: "Staff member created successfully.",
//       auth: true,
//     };
//     response.success_message(data, res);
//   } catch (err) {
//     const data = { message: err.message };
//     response.validation_error_message(data, res);
//   }
// };

// // List Staff
// exports.list = async function (req, res) {
//   try {
//     const filter = { isDeleted: false };
//     const request = req.query;

//     if (request.staff) {
//       const splittedVal = request.staff.split(",").map((id) => mongoose.Types.ObjectId(id));
//       filter._id = { $in: splittedVal };
//     }
//     if (request.search_staff) {
//       filter.staffName = { $regex: `^${request.search_staff}`, $options: "i" };
//     }

//     const staffRecordsCount = await staffModel.countDocuments(filter);
//     const staffRec = await staffModel
//       .find(filter)
//       .sort({ _id: -1 })
//       .skip(Number(request.skip))
//       .limit(Number(request.limit));

//     response.success_message(staffRec, res, staffRecordsCount);
//   } catch (err) {
//     const data = { message: err.message };
//     response.validation_error_message(data, res);
//   }
// };

// // View Staff
// exports.view = async function (req, res) {
//   try {
//     const staff = await staffModel
//       .findOne({ _id: req.params.id })
//       .select("-__v -updated_at");

//     if (staff) {
//       const data = { staff_details: staff };
//       response.success_message(data, res);
//     } else {
//       const data = { staff_details: [], message: "No result found" };
//       response.success_message(data, res);
//     }
//   } catch (err) {
//     const data = { message: err.message };
//     response.validation_error_message(data, res);
//   }
// };

// // Update Staff
// exports.update = async function (req, res) {
//   try {
//     const auth_user = verify.verify_token(req.headers.token).details;
//     const request = req.body;
//     const staffName = request.name.trim().toLowerCase();

//     // Check if staff member with the same name already exists
//     const duplicateRec = await staffModel.findOne({
//       staffName: { $regex: new RegExp(`^${staffName}$`, "i") },
//       _id: { $ne: req.params.id },
//       user_id: auth_user.id,
//     });

//     if (duplicateRec) {
//       const data = { message: "Staff member already exists." };
//       return response.validation_error_message(data, res);
//     }

//     const newValues = {
//       $set: {
//         staffName: request.name,
//         employeeId: request.employeeId,
//         mobileNumber: request.mobileNumber,
//       },
//     };

//     const staff = await staffModel.findByIdAndUpdate(req.params.id, newValues, { new: true });

//     if (staff) {
//       const data = { message: "Staff member updated successfully." };
//       response.success_message(data, res);
//     } else {
//       const data = { message: "Staff member not found." };
//       response.validation_error_message(data, res);
//     }
//   } catch (err) {
//     const data = { message: err.message };
//     response.validation_error_message(data, res);
//   }
// };

// // Delete Staff
// exports.delete = async function (req, res) {
//   try {
//     const results = await staffModel.deleteOne({ _id: req.params.id });

//     if (results.deletedCount > 0) {
//       const data = { message: "Deleted Successfully", deletedCount: results.deletedCount };
//       response.success_message(data, res);
//     } else {
//       const data = { message: "Record Not Found", deletedCount: results.deletedCount };
//       response.success_message(data, res);
//     }
//   } catch (err) {
//     const data = { message: err.message };
//     response.validation_error_message(data, res);
//   }
// };

// // Soft Delete Staff
// exports.softDelete = async function (req, res) {
//   try {
//     const staff = await staffModel.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: { isDeleted: true } },
//       { new: true }
//     );

//     const data = {
//       message: staff ? "Deleted Successfully" : "Record Not Found",
//       deletedCount: staff ? 1 : 0,
//     };
//     response.success_message(data, res);
//   } catch (error) {
//     const data = { message: error.message };
//     response.validation_error_message(data, res);
//   }
// };

