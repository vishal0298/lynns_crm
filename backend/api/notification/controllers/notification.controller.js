const productModel = require("../../products/models/products.model");
const inventory = require("../../inventory/models/inventory.model");
const response = require("../../../response");
const verify = require("../../../verify.token");
const inventoryModel = require("../../inventory/models/inventory.model");
const gcm = require("node-gcm");
const usersModel = require("../../auth/models/auth.model");
const notificationModel = require("../models/notification.model");
const notificationSettingsModel = require("../../notificationSettings/models/notificationSettings.model");
const { default: mongoose } = require("mongoose");

exports.sendFCMMessage = async (messageObj, to) => {
  try {
    for (const userId of to) {
      messageObj.userId = userId;
      const notificationRec = await notificationModel.create(messageObj);
      console.log("notification created :", notificationRec);
    }
    const notificationRec = await notificationSettingsModel.findOne().lean();
    const fcm = await new gcm.Sender(notificationRec.serverKey);

    let registrationTokens = [];
    for (const _id of to) {
      const user = await usersModel.findById(_id).lean();
      if (user) {
        registrationTokens.push(user.fcmToken);
      }
    }
    console.log("fcmTokens :", registrationTokens);
    const message = await new gcm.Message({
      data: {
        title: messageObj.title,
        body: messageObj.body,
      },
    });
    fcm.send(message, { registrationTokens }, (err, resp) => {
      console.log("resp :", resp);
      if (err) {
        return err;
      } else {
        return resp;
      }
    });
  } catch (error) {
    console.log("error :", error);
    return error;
  }
};

exports.minStockAlert = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details.id;
    const productRecs = await productModel.find().lean();
    let minQuanProducts = "";
    let data = {
      title: "Minimum quantity alert",
      body: "The following products have minimum quantity",
    };
    for (const item of productRecs) {
      const inventoryRec = await inventoryModel
        .findOne({
          productId: item._id,
        })
        .lean();
      if (inventoryRec) {
        if (parseInt(inventoryRec.quantity) <= parseInt(item.alertQuantity)) {
          await notificationModel.create({
            title: data.title,
            body: `${
              item.name.charAt(0).toUpperCase() + item.name.substring(1)
            }-${inventoryRec.quantity}`,
            userId: authUser,
          });
          minQuanProducts += `${
            item.name.charAt(0).toUpperCase() + item.name.substring(1)
          }-${inventoryRec.quantity}, `;
        }
      }
    }
    data.body = minQuanProducts.substring(0, minQuanProducts.length - 2);
    if (Object.keys(minQuanProducts).length > 0) {
      await this.sendFCMMessage(data, [authUser]);
    } else {
      return;
    }
  } catch (error) {
    console.log("error :", error);
    return error;
  }
};

exports.notification = async (req, res) => {
  try {
    let data = {};
    const authUser = verify.verify_token(req.headers.token).details;
    const stockAlert = await this.minStockAlert(authUser.id);
    data.minQuantityProducts = stockAlert;
    let minQuanProd = {};
    // if (stockAlert.length > 0) {
    //   for (const obj of stockAlert) {
    //     for (const key in obj) {
    //       minQuanProd[key+key]
    //     }
    //   }
    // }
    let messObj = {
      title: "Minimum quantity alert",
      body: "The following products have minimum quantity",
      data: minQuanProd,
    };
    await this.sendFCMMessage(messObj, [authUser.id]);
    response.success_message(data, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.list = async (req, res) => {
  try {
    const request = req.query;
    const authUser = verify.verify_token(req.headers.token).details;

    const notificationRec = await notificationModel
      .find({
        userId: authUser.id,
      })
      .skip(request.skip)
      .limit(request.limit)
      .sort({
        _id: -1,
      })
      .lean();

    response.success_message(notificationRec, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.delete = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.headers.token).details;
    const { _id } = req.body;

    if (!_id || _id.length < 1) {
      const notificationRec = await notificationModel.deleteMany({
        userId: authUser.id,
      });
      if (notificationRec.deletedCount > 0) {
        return response.success_message(
          { message: "All notifications cleared successfully" },
          res
        );
      } else {
        return response.success_message(
          { message: "You don't have any notifications to clear" },
          res
        );
      }
    } else if (Array.isArray(_id)) {
      const notificationRec = await notificationModel.deleteMany({
        _id: { $in: _id },
        userId: authUser.id,
      });
      if (notificationRec.deletedCount > 0) {
        return response.success_message(
          { message: "Notifications deleted successfully" },
          res
        );
      } else {
        return response.error_message(
          { message: "You don't have any notifications" },
          res
        );
      }
    }
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.update = async (req, res) => {
  try {
    const authUser = verify.verify_token(req.header.token).details;
    const notificationRec = await notificationModel.updateMany(
      {},
      { mark: false }
    );
    if (notificationRec) {
      return response.success_message(
        { message: "Notifications Read successfully" },
        res
      );
    }
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};
