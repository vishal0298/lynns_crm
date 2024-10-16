const categoryModel = require("../models/category.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const commonDate = require("../../common/date");

let data;

exports.create = async (req, res) => {
  let request = req.body;
  const auth_user = verify.verify_token(req.headers.token).details;
  let filePath = "";
  if (req.file) {
    filePath = req.file.path;
  }
  try {
    categoryModel.create(
      {
        // type: request.type,
        name: request.name,
        slug: request.slug,
        // parent_Category: request.parent_Category,
        image: filePath,
        user_id: auth_user.id,
        created_at: new Date(),
      },
      (err, category) => {
        if (err) {
          data = { message: err.message };
          response.validation_error_message(data, res);
        } else {
          if (category) {
            data = {
              message: "Category is created successfully.",
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
    console.log("err", err);
    response.validation_error_message(data, res);
  }
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    var filter = {};
    filter.isDeleted = false;

    if (request.category) {
      let splittedVal = request.category.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filter._id = { $in: splittedVal };
    }
    if (request.search_category) {
      filter.name = {
        $regex: `^${request.search_category}`,
        $options: "i",
      };
    }
    const categoryRecordsCount = await categoryModel.find(filter).count();
    const categoryRec = await categoryModel
      .find(filter)
      .sort({ _id: -1 })
      .skip(request.skip)
      .limit(request.limit)
      .lean();
    categoryRec.forEach((item) => {
      if (item.image) {
        item.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.image}`;
      }
    });
    response.success_message(categoryRec, res, categoryRecordsCount);
  } catch (err) {
    console.log(err);
    response.validation_error_message({ message: err.message }, res);
  }
};

exports.view = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const optionsData = {
      select: "-__v -updated_at",
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    const result = await categoryModel.paginate(filter, optionsData);
    result.docs.forEach((item) => {
      if (item.image) {
        item.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.image}`;
      }
    });
    if (result.docs.length > 0) {
      data = {
        category_details: result.docs[0],
        // total_pages: result.totalPages,
        // current_page: result.page,
      };
      response.success_message(data, res);
    } else {
      data = {
        category_details: [],
        message: "No result found",
      };
      response.success_message(data, res);
    }
  } catch (err) {
    data = { message: err._message };
    response.validation_error_message(data, res);
  }
};

exports.update = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;
    const request = req.body;

    const imageRec = await categoryModel.findById(req.params.id);
    let newImage = imageRec.image;
    if (req.file) {
      newImage = req.file.path;
      if (imageRec.image !== "" && fs.existsSync(imageRec.image)) {
        const rootDir = path.resolve("./");
        let oldImagePath = path.join(rootDir, imageRec.image);
        fs.unlinkSync(oldImagePath);
      }
    }

    const newvalues = {
      $set: {
        type: request.type,
        name: request.name,
        slug: request.slug,
        image: newImage,
        parent_Category: request.parent_Category,
      },
    };

    const duplicateRec = await categoryModel.findOne({
      type: request.type,
      name: request.name,
      slug: request.slug,
      image: newImage,
      parent_Category: request.parent_Category,
      _id: { $ne: req.params.id },
      user_id: auth_user.id,
    });

    if (duplicateRec) {
      const data = { message: "Category Already Exists.." };
      response.validation_error_message(data, res);
    } else {
      const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        newvalues
      );

      if (category) {
        const data = { message: "Category updated successfully." };
        response.success_message(data, res);
      }
    }
  } catch (error) {
    const data = { message: error.message };
    console.log("error", error);
    response.validation_error_message(data, res);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const category = await categoryModel.findOneAndUpdate(
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
