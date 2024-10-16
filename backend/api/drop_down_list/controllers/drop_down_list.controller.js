const response = require("../../../response");
const customerModel = require("../../customers/models/customers.model");
const vendorModel = require("../../vendor/models/vendor.model");
const categoryModel = require("../../category/models/category.model");
const unitModel = require("../../units/models/unit_type.model");
const staffModel = require("../../staff/models/staff.model");
const productModel = require("../../products/models/products.model");
const taxModel = require("../../tax/models/tax.model");
const bankModel = require("../../bank_settings/models/bankSettings.model");
const roleModel = require("../../role/models/roles.model");
const signatureModel = require("../../signature/models/signature.model");

exports.customerList = async (req, res) => {
  try {
    const customersRec = await customerModel.find({ isDeleted: false , status: "Active"});
    response.success_message(customersRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.vendorList = async (req, res) => {
  try {
    const vendorRecords = await vendorModel.find({ isDeleted: false });
    response.success_message(vendorRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.categoryList = async (req, res) => {
  try {
    const categoryRecords = await categoryModel.find({ isDeleted: false });
    response.success_message(categoryRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.unitList = async (req, res) => {
  try {
    const unitRecords = await unitModel.find({ isDeleted: false });
    response.success_message(unitRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
exports.staffList = async (req, res) => {
  try {
    const staffRecords = await staffModel.find({ isDeleted: false });
    response.success_message(staffRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.productList = async (req, res) => {
  try {
    const productRecords = await productModel
      .find({ isDeleted: false })
      .populate("category")
      .populate("units")
      .populate("tax");
    response.success_message(productRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.taxList = async (req, res) => {
  try {
    const TaxRecords = await taxModel.find({ status: true,isDeleted:false });
    response.success_message(TaxRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.bankList = async (req, res) => {
  try {
    const bankRecords = await bankModel.find({ isDeleted: false });
    response.success_message(bankRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.roleList = async (req, res) => {
  try {
    const roleRecords = await roleModel.find({ isDeleted: false });
    response.success_message(roleRecords, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.signatureList = async (req, res) => {
  try {
    const signatureRecords = await signatureModel.find({ isDeleted: false , status: true }).lean();
    const modifiedSignatureList = signatureRecords.map(signature => ({
      ...signature,
      value: signature._id,
      label: signature.signatureName
    }));

    for (const item of modifiedSignatureList) {
      item.signatureImage = `${process.env.DEVLOPMENT_BACKEND_URL}/${item.signatureImage}`;
    }
    response.success_message(modifiedSignatureList, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
