const invoiceSeetingsSeeder = require("./invoiceSettings.seeder");
const currencySeeder = require("./currency.seeder");
const roleSeeder = require("./role.seeder");
const preferenceSettingsSeeder = require("./preferenceSettings.seeder");
const userSeeder = require("./user.seeder");
const invoiceTemplateSeeder = require("./invoiceTemplate.seeder");
const purchaseTemplateSeeder = require("./purchaseTemplate.seeder");
const purchaseOrderTemplateSeeder = require("./purchaseOrderTemplate.seeder");
const purchaseReturnTemplateSeeder = require("./purchaseReturn.seeder");
const quotationTemplateSeeder = require("./quotationTemplate.seeder");
const salesReturnTemplateSeeder = require("./salesReturnTemplate.seeder");
const paymentSettingsSeeder = require("./paymentSettings.seeder");
const mongoose = require("mongoose");
const notificationSettingsSeeder = require("./notificationSettings.seeder");
var env = process.env.NODE_ENV || "development";
const config = require("../dbconfig")[env];

mongoose.set("strictQuery", true);
mongoose.connect(
  `mongodb://${config.database.host}:${config.database.port}/${config.database.db}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, response) {
    if (err) {
      console.log("Database Connection Error", err.message);
    } else {
      // console.log('Connected to ', response);  useFindAndModify: false,
    }
  }
);

const initiateSeeding = async () => {
  await currencySeeder.currencySeeder();
  await userSeeder.userSeeding();
  await roleSeeder.roleSeeding();
  await invoiceSeetingsSeeder.invoiceSettingsSeeding();
  await preferenceSettingsSeeder.preferenceSettingsSeeding();
  await invoiceTemplateSeeder.invoiceTemplateSeeding();
  await purchaseTemplateSeeder.purchaseTemplateSeeding();
  await purchaseOrderTemplateSeeder.purchaseOrderTemplateSeeding();
  await purchaseReturnTemplateSeeder.purchaseOrderTemplateSeeding();
  await quotationTemplateSeeder.invoiceTemplateSeeding();
  await salesReturnTemplateSeeder.salesReturnTemplateSeeding();
  await paymentSettingsSeeder.paymentSettingsSeeding();
  await notificationSettingsSeeder.notificationSettingsSeeding();
  console.log("seeding completed successfully");
};

initiateSeeding();
