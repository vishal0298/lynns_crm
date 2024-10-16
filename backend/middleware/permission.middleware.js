const rolesModel = require("../api/role/models/roles.model");
const permissionModel = require("../api/permissions/models/permission.model");
const verify = require("../verify.token");
response = require("../response");

exports.checkAccess = (module, action) => {
  return async (req, res, next) => {
    try {
      const user = verify.verify_token(req.headers.token).details;
      if (user.role == "Super Admin") {
        next();
      } else {
        const result = await permissionModel.findOne({
          roleName: user.role,
        });
        if (!result) {
          response.unauthorized_error_message(
            "You don't have a access for that operation",
            res
          );
        } else {
          if (result.allModules) {
            next();
          } else {
            result["modules"].forEach((item) => {
              if (item.module == module) {
                if (item.permissions.all || item.permissions[action]) {
                  return next();
                } else {
                  response.unauthorized_error_message(
                    "You don't have a access for that operation",
                    res
                  );
                }
              }
            });
          }
        }
      }
    } catch (error) {
      response.error_message(error.message, res);
    }
  };
};
