const mongoose = require("mongoose");
const rolesModel = require("../../api/role/models/roles.model");
const userModel = require("../../api/auth/models/auth.model");
const permissionModel = require("../../api/permissions/models/permission.model");

exports.roleSeeding = async () => {
  try {
    const roleRecord = await rolesModel
      .findOne({
        roleName: "Super Admin",
      })
      .lean();
    if (roleRecord) {
      return;
    } else {
      const userRecord = await userModel.findOne({ role: "Super Admin" });
      const role_record = await rolesModel.create({
        roleName: "Super Admin",
        userId: userRecord._id,
      });
      if (role_record) {
        permissionObj = {
          roleId: role_record._id,
          roleName: "Super Admin",
          userId: userRecord._id,
          allModules: true,
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
                view: true,
                delete: false,
                all: false,
              },
            },
            {
              label: "Credit Note",
              module: "creditNote",
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
              label: "Debit Note",
              module: "debitNote",
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
              label: "Quotation Report",
              module: "quotationReport",
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
      }
    }



    const roleRecordAdmin = await rolesModel
      .findOne({
        roleName: "Admin",
      })
      .lean();
    if (roleRecordAdmin) {
      return;
    } else {
      const userRecordAdmin = await userModel.findOne({ role: "Admin" });
      const role_record_admin = await rolesModel.create({
        roleName: "Admin",
        userId: userRecordAdmin._id,
      });
      if (role_record_admin) {
        permissionObj = {
          roleId: role_record_admin._id,
          roleName: "Admin",
          userId: userRecordAdmin._id,
          allModules: true,
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
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Vendor",
              module: "vendor",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Ledger",
              module: "ledger",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Product or Services",
              module: "productsOrServices",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Category",
              module: "category",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Unit",
              module: "unit",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Staff",
              module: "staff",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Inventory",
              module: "inventory",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Invoice",
              module: "invoice",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Sales Return",
              module: "salesreturn",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Purchase",
              module: "purchase",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Purchase Order",
              module: "purchaseOrder",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Purchase Return",
              module: "purchasereturn",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Expense",
              module: "expense",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },

            {
              label: "Payment",
              module: "payment",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Quotation",
              module: "quotation",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Delivery Challan",
              module: "deliveryChallan",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Quotation Report",
              module: "quotationReport",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Payment Summary Report",
              module: "paymentSummaryReport",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "User",
              module: "user",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Role",
              module: "role",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Delete Account Request",
              module: "deleteAccountRequest",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Membership",
              module: "membership",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
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
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Invoice Settings",
              module: "invoiceSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Payment Settings",
              module: "paymentSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Bank Settings",
              module: "bankSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Tax Settings",
              module: "taxSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Email Settings",
              module: "emailSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Preference Settings",
              module: "preferenceSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Notification Settings",
              module: "notificationSettings",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
            {
              label: "Change Password",
              module: "changePassword",
              permissions: {
                create: true,
                update: true,
                view: true,
                delete: true,
                all: true,
              },
            },
  
          ],
        };
      const permissionRec = await permissionModel.create(permissionObj);
      }
    }


  } catch (error) {
    console.log("error :", error);
  }
};
