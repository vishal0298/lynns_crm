// const response = require("../response");
// const tenantModel = require("../api/tenant/models/tenant.model");
// const mongoose = require("mongoose");
// const env = process.env.NODE_ENV || "development";
// const config = require("./dbconfig")[env];

// exports.tenantDBConnection = async (req, res, next) => {
//   try {
//     const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };
//     const tenantId = req.headers.tenantId;

//     if (tenantId) {
//       const tenantRecord = await tenantModel.findById(tenantId).lean();
//       if (tenantRecord) {
//         const tenantDB = mongoose.createConnection(
//           `mongodb://${config.database.host}:${config.database.port}/${config.database.db}-${tenantRecord.dbName}`,
//           mongooseOptions
//         );
//         req.headers.DB = tenantDB;
//         next();
//       } else {
//         response.validation_error_message({
//           message: "Tenant not found , please register",
//         });
//       }
//     } else {
//       response.validation_error_message(
//         {
//           message: "Provide a tenant id",
//         },
//         res
//       );
//     }
//   } catch (error) {
//     response.error_message(error.message, res);
//     console.log("error :", error);
//   }
// };
