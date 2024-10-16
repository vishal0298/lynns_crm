const signatureModel = require("../models/signature.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }
    const signatureName = request.signatureName.trim().toLowerCase();
    const existingDefaultSignature = await signatureModel.findOne({
      userId: authUser.id,
      markAsDefault: true,
      isDeleted: false,
    });
    let markAsDefault = false;
    if (existingDefaultSignature == null) {
      markAsDefault = request.markAsDefault;
    } else {
      if (request.markAsDefault) {
        markAsDefault = true;
        // Turn off markAsDefault for existing default signature
        if (existingDefaultSignature) {
          existingDefaultSignature.markAsDefault = false;
          await existingDefaultSignature.save();
        }
      } else {
        // Set new signature as default if markAsDefault is false
        markAsDefault = true;
      }
    }
    const duplicateRecord = await signatureModel.findOne({
      signatureName: { $regex: new RegExp(`^${signatureName}$`, "i") },
      isDeleted: false,
    });
    if (duplicateRecord) {
      const data = { message: "Signature name already exists." };
      return response.validation_error_message(data, res);
    }
    const signatureRecord = await signatureModel.create({
      signatureName: request.signatureName,
      signatureImage: filePath,
      status: request.status,
      markAsDefault: markAsDefault,
      userId: authUser.id,
      isDeleted: false,
    });
    if (signatureRecord) {
      const data = {
        message: "Signature added successfully",
      };
      return response.success_message(data, res);
    }
  } catch (error) {
    console.log("Error:", error);
    return response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const request = req.body;

    const imageRecord = await signatureModel.findById(req.params.id);
    let newImage = imageRecord.signatureImage;
    if (req.file) { 
      newImage = req.file.path;
      if (
        imageRecord.signatureImage !== "" &&
        fs.existsSync(imageRecord.signatureImage)
      ) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, imageRecord.signatureImage);
        fs.unlinkSync(oldImagePath);
      }
    }
    const signatureName = request.signatureName.trim().toLowerCase();
    const duplicateRecord = await signatureModel.findOne({
      _id: { $ne: req.params.id },
      signatureName: { $regex: new RegExp(`^${signatureName}$`, "i") },
      isDeleted: false,
    });
    if (duplicateRecord) {
      const data = { message: "Signature name already exists." };
      return response.validation_error_message(data, res);
    } else {
      let markAsDefault = false;
      const existingDefaultSignature = await signatureModel.findOne({
        // userId: authUser.id,
        markAsDefault: true,
        isDeleted: false,
       // _id: { $ne: req.params.id },
        _id: req.params.id,
      });
      
      if(request.markAsDefault=='true'){
        //other data set as false
  await signatureModel.updateMany(
    { _id: { $ne: req.params.id }, /*userId: authUser.id,*/ isDeleted: false },
    { markAsDefault: false }
  );
      }


      if (request.markAsDefault) {
        // Turn off markAsDefault for existing default signature
        if (existingDefaultSignature) {
          existingDefaultSignature.markAsDefault = request.markAsDefault;
          await existingDefaultSignature.save();

        }
      } else if (!existingDefaultSignature) {
        markAsDefault = true;
      }
      let newvalues = {
        $set: {
          signatureName: request.signatureName,
          signatureImage: newImage,
          status: request.status,
          markAsDefault: request.markAsDefault,
        },
      };
      const signature = await signatureModel.findByIdAndUpdate(
        req.params.id,
        newvalues
      );
      if (signature) {
        const data = { message: "Signature updated successfully." };
        return response.success_message(data, res);
      }
    }
    
  } catch (error) {
    console.log("Error:", error);
    return response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const signatureNameFilter = req.query.signatureName;
    const signatureId = req.query.signatureId;

    var filter = {
      //userId: authUser.id,
      isDeleted: false,
    };
    if (signatureNameFilter) {
      filter.signatureName = {
        $regex: new RegExp(`^${signatureNameFilter}$`, "i"),
      };
    }
    if (signatureId) {
      const signatureToUpdate = await signatureModel.findOneAndUpdate(
        { _id: signatureId, /*userId: authUser.id,*/ isDeleted: false },
        { markAsDefault: true },
        { new: true }
      );

      //other data set as false
      await signatureModel.updateMany(
        { _id: { $ne: signatureId }, /*userId: authUser.id,*/ isDeleted: false },
        { markAsDefault: false }
      );
    }
    const signatureList = await signatureModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(req.query.skip)
      .limit(req.query.limit);

    for (const item of signatureList) {
      if (item.signatureImage !== "") {
        item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
      }
    }

    const totalRecords = await signatureModel.find(filter).count();
    return response.success_message(signatureList, res, totalRecords);
  } catch (error) {
    console.log("Error:", error);
    return response.error_message(error.message, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const signature = await signatureModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } }
    );
    data = { message: "Signature deleted Successfully" };
    response.success_message(data, res);
  } catch (error) {
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};

exports.update_status = async (req, res) => {
  try {
    var request = req.body;
    var newvalues = {
      $set: {
        status: request.status,
      },
    };
    const signatureRecord = await signatureModel.findByIdAndUpdate(
      req.params.id,
      newvalues
    );
    if (signatureRecord) {
      data = { message: "Status updated successfully." };
      response.success_message(data, res);
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};
