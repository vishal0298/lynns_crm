const tenantModel = require("../models/tenant.model");
const response = require("../../../response");
const bcrypt = require("bcryptjs");

exports.addTenant = async (req, res) => {
  try {
    const request = req.body;
    const duplicateRecord = await tenantModel.findOne({ email: request.email });
    if (duplicateRecord) {
      response.validation_error_message(
        {
          message: "tenant email is already present",
        },
        res
      );
    } else {
      hashedPassword = bcrypt.hashSync(request.password, 8);
      const tenantRecord = await tenantModel.create({
        tenantName: request.tenantName,
        email: request.email,
        password: hashedPassword,
        url: request.url,
        dbName: request.dbName,
      });
      response.success_message(tenantRecord, res);
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.viewTenant = async (req, res) => {
  try {
    const tenantRecord = await tenantModel.findOne({ id: req.params.id });
    response.success_message(tenantRecord, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
