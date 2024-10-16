const permissionModel = require("../models/permission.model");
const response = require("../../../response");
const verify = require("../../../verify.token");

exports.updatePermission = async (req, res) => {
  try {
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    request.userId = authUser.id;
    const permissionRec = await permissionModel.findByIdAndUpdate(
      req.params.id,
      request
    );
    if (permissionRec) {
      response.success_message(
        {
          message: "permissions updated successfully",
        },
        res
      );
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error.message, res);
  }
};

exports.viewPermissions = async (req, res) => {
  try {
    //const userId = verify_token(req.headers.token).details.id;
    const roleRec = await permissionModel.findOne({
      roleId: req.params.id,
    });
    response.success_message(roleRec, res);
  } catch (error) {
    response.error_message(error, res);
  }
};
