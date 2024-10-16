const response = require("../../../response");
const rolesModel = require("./../models/roles.model");
const userModel = require("../../auth/models/auth.model");
const permissionModel = require("../../permissions/models/permission.model");
const mongoose = require("mongoose");
const { verify_token } = require("../../../verify.token");
const resUpdate = require("../../common/date");

exports.addRole = async (req, res) => {
  try {
    const userId = verify_token(req.headers.token).details.id;
    req.body.userId = userId;
    const roleName = req.body.roleName.trim().toLowerCase();

    const role = await rolesModel.findOne({
      userId: userId,
      roleName: { $regex: new RegExp(`^${roleName}$`, "i") },
    });

    if (role) {
      data = { message: "Role name already exists." };
      response.validation_error_message(data, res);
    } else {
      const result = await rolesModel.create(req.body);
      if (result) {
        let allModules = result.roleName == "Super Admin" ? true : false;
        permissionObj = {
          roleId: result._id,
          roleName: req.body.roleName,
          userId: userId,
          allModules: allModules,
          modules: [
            {
              label: "Dashboard",
              module: "dashboard",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Customer",
              module: "customer",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Vendor",
              module: "vendor",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Ledger",
              module: "ledger",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Product or Services",
              module: "productsOrServices",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Category",
              module: "category",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Unit",
              module: "unit",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Staff",
              module: "staff",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Inventory",
              module: "inventory",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Invoice",
              module: "invoice",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Sales Return",
              module: "salesreturn",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Purchase",
              module: "purchase",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Purchase Order",
              module: "purchaseOrder",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Purchase Return",
              module: "purchasereturn",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Expense",
              module: "expense",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },

            {
              label: "Payment",
              module: "payment",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Quotation",
              module: "quotation",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Delivery Challan",
              module: "deliveryChallan",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Payment Summary Report",
              module: "paymentSummaryReport",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "User",
              module: "user",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Role",
              module: "role",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Delete Account Request",
              module: "deleteAccountRequest",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Membership",
              module: "membership",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Accoount Settings",
              module: "accountSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Company Settings",
              module: "companySettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Invoice Settings",
              module: "invoiceSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Payment Settings",
              module: "paymentSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Bank Settings",
              module: "bankSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Tax Settings",
              module: "taxSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Email Settings",
              module: "emailSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Preference Settings",
              module: "preferenceSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Notification Settings",
              module: "notificationSettings",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
            {
              label: "Change Password",
              module: "changePassword",
              permissions: {
                create: false,
                update: false,
                view: false,
                delete: false,
                all: false,
              },
            },
          ],
        };

        const permissionRec = await permissionModel.create(permissionObj);
        response.success_message({ message: "role added successfully" }, res);
      }
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error, res);
  }
};

exports.updateRole = async (req, res) => {
  try {
    const userId = verify_token(req.headers.token).details.id;

    //restrict to edit the super admin role
    const roleToUpdate = await rolesModel.findById(req.params.id);
    const previousRole = roleToUpdate.roleName;
    console.log("roleToUpdate :", roleToUpdate);
    if (roleToUpdate.roleName === "Super Admin") {
      const data = {
        message: "You are not allowed to edit the Super Admin role.",
      };
      response.validation_error_message(data, res);
      return;
    }

    const roleName = req.body.roleName.trim().toLowerCase();

    const role = await rolesModel.findOne({
      _id: { $ne: req.params.id },
      user_id: userId,
      roleName: { $regex: new RegExp(`^${roleName}$`, "i") },
    });
    if (role) {
      data = { message: "Role name already exists." };
      response.validation_error_message(data, res);
    } else {
      const result = await rolesModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            roleName: req.body.roleName,
          },
        },
        {
          new: true,
        }
      );
      const permissionRecord = await permissionModel.findOneAndUpdate(
        { roleId: req.params.id },
        {
          $set: {
            roleName: req.body.roleName,
          },
        },
        { new: true }
      );
      await userModel.updateMany(
        { role: previousRole },
        {
          $set: {
            role: req.body.roleName,
          },
        }
      );

      response.success_message(result, res);
    }
  } catch (error) {
    response.error_message(error, res);
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roleRec = await rolesModel.find().lean();
    if (roleRec.length > 0) {
      roleRec.forEach((item) => {
        item.createdAt = resUpdate.resDate(item.createdAt);
        item.updatedAt = resUpdate.resDate(item.updatedAt);
      });
      // console.log(item)
    }
    response.success_message(roleRec, res);
  } catch (error) {
    console.log(error);
    response.error_message(error.message, res);
  }
};
