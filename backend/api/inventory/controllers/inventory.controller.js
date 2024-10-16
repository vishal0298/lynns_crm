const inventoryModel = require("../models/inventory.model");
const productsModel = require("../../products/models/products.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const notification = require("../../notification/controllers/notification.controller");
const mongoose = require("mongoose");

let data;

//add stock
exports.create = async (req, res) => {
  let request = req.body;
  const auth_user = verify.verify_token(req.headers.token).details;

  try {
    const Invstock = await inventoryModel.findOne({
      productId: request.productId,
      isDeleted: false,
    });

    if (Invstock) {
      const update_quantity =
        parseInt(Invstock.quantity) + parseInt(request.quantity);

      var newvalues = {
        $set: {
          productId: request.productId,
          units: request.units,
          quantity: update_quantity,
          notes: request.notes,
        },
      };

      const inven = await inventoryModel.findOneAndUpdate(
        { productId: request.productId, isDeleted: false },

        newvalues
      );
      data = {
        message: "Stock added successfully",
        auth: true,
      };
      response.success_message(data, res);
    } else {
      inventoryModel.create(
        {
          productId: request.productId,
          units: request.units,
          quantity: request.quantity,
          notes: request.notes,
          user_id: auth_user.id,
          isDeleted: false,
          created_at: new Date(),
        },
        (err, inventory) => {
          if (err) {
            data = { message: err.message };
            response.validation_error_message(data, res);
          } else {
            if (inventory) {
              data = {
                message: "Stock added successfully",
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
    }
  } catch (err) {
    data = { message: err.message };
    response.validation_error_message(data, res);
  }
};

//Stock remove
exports.update = async (req, res) => {
  try {
    var request = req.body;
    const auth_user = verify.verify_token(req.headers.token).details;
    const inv = await inventoryModel.findOne({
      productId: mongoose.Types.ObjectId(request.productId),
    });
    if (inv) {
      if (parseInt(inv.quantity) >= parseInt(request.quantity)) {
        const update_quantity =
          parseInt(inv.quantity) - parseInt(request.quantity);

        var newvalues = {
          $set: {
            quantity: update_quantity,
            notes: request.notes,
          },
        };

        const inven = await inventoryModel.findOneAndUpdate(
          { productId: mongoose.Types.ObjectId(request.productId) },
          newvalues
        );

        if (inven) {
          await notification.minStockAlert(req, res);
          data = { message: "Stock updated successfully." };
          response.success_message(data, res);
        }
      } else {
        response.validation_error_message(
          {
            message: [
              "Stock out quantity must be less than inventory quantity",
            ],
          },
          res
        );
      }
    } else {
      response.validation_error_message(
        {
          message: ["Stock out quantity must be less than inventory quantity"],
        },
        res
      );
    }
  } catch (err) {
    data = { message: err.message };
    response.error_message(data, res);
  }
};

//inventory list

exports.list = async (req, res) => {
  try {
    const request = req.query;
    const pipeline = [
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "productId",
          as: "inventoryInfo",
        },
      },

      // {
      //   $unwind: {
      //     path: '$inventoryInfo',
      //
      //   },
      // },
      {
        $lookup: {
          from: "unit_types",
          localField: "units",
          foreignField: "_id",
          as: "unitInfo",
        },
      },
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          "inventoryInfo.units": 1,
          "inventoryInfo.quantity": 1,
          "inventoryInfo.isDeleted": 1,
          "inventoryInfo.name": 1,
          "unitInfo.name": 1,
          name: 1,
          sku: 1,
          sellingPrice: 1,
          purchasePrice: 1,
          isDeleted: 1,
        },
      },
      {
        $project: {
          "unitInfo.name": 1,
          name: 1,
          sku: 1,
          sellingPrice: 1,
          purchasePrice: 1,
          isDeleted: 1,
          inventory_Info: {
            $filter: {
              input: "$inventoryInfo",
              as: "info",
              cond: {
                $and: [
                  {
                    $eq: ["$$info.isDeleted", false],
                  },
                ],
              },
            },
          },
        },
      },
    ];
    if (request.product) {
      let splittedVal = request.product.split(",").map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      pipeline[2].$match._id = { $in: splittedVal };
    }
    const inventoryRecordsCount = (await productsModel.aggregate(pipeline))
      .length;

    if (request.skip) {
      pipeline.push({ $skip: parseInt(request.skip) });
    }

    if (request.limit) {
      pipeline.push({ $limit: parseInt(request.limit) });
    }
    const inventory = await productsModel.aggregate(pipeline);
    if (inventory) {
      response.success_message(inventory, res, inventoryRecordsCount);
    }
  } catch (err) {
    console.log("err :", err);
    const data = { message: err.message };
    response.error_message(data, res);
  }
};

//filter by product Id
exports.filterByProductId = async (req, res) => {
  try {
    let filter = {};
    if (req.query.productId) {
      filter.productId = req.query.productId;
    } else if (req.query.start_date && req.query.end_date) {
      filter.created_at = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    } else {
      const dates = commonDate.getDateRange(req.query.days);
      filter.created_at = {
        $gte: dates.startDate,
        $lte: dates.endDate,
      };
    }

    const inventoryRec = await inventoryModel.find(filter);
    response.success_message(inventoryRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

// delete the inventory
exports.softDelete = async (req, res) => {
  try {
    const inventory_model = await inventoryModel.updateMany(
      { productId: req.params.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );
    data = { message: "Deleted Successfully", deletedCount: 1 };
    response.success_message(data, res);
  } catch (error) {
    data = { message: error.message };
    response.validation_error_message(data, res);
  }
};

exports.inventoryHistory = async (req, res) => {
  try {
    const request = req.query;
    const pipeline = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "productId",
          as: "inventoryInfo",
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "units",
          foreignField: "_id",
          as: "unitInfo",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
    ];
    if (request.skip) {
      pipeline.push({ $skip: parseInt(request.skip) });
    }

    if (request.limit) {
      pipeline.push({ $limit: parseInt(request.limit) });
    }

    const inventoryRecords = productsModel.aggregate(pipeline);

    response.success_message(inventoryRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
