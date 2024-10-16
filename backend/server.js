const dotenv = require("dotenv").config();
var env = process.env.NODE_ENV || "development";
var config = require("./config/dbconfig")[env];
var jwtmiddleware = require("./middleware/jwt.mimiddleware");
const express = require("express");
const helmet = require("helmet");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const CronJob = require("cron").CronJob;
const recurringInvoiceGeneration = require("./config/cron/cron");

var app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: process.env.DEVLOPMENT_FRONTEND_URL,
  })
);

// const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// const ext = path.extname(item.image);
// fs.copyFileSync(`./${item.image}`, `./uploads/dest/${uniqueSuffix+ext}`);

var port = process.env.PORT || 7002;

if (process.env.NODE_ENV == "production") {
  try {
    https
      .createServer(
        {
          key: fs.readFileSync("ssl.key"),
          cert: fs.readFileSync("ssl.crt"),
        },
        app
      )
      .listen(port, function () {
        console.log(
          "Production Server is up and running on port number " +
            port +
            " Https"
        );
      });
  } catch (err) {
    console.log("Production error", err.message);
  }
} else {
  http.createServer(app).listen(port, function () {
    console.log(
      "Development Server is up and running on port number " +
        port +
        " with Http"
    );
  });
}

// new CronJob(
//   "0 0 6 * * *",
//   recurringInvoiceGeneration,
//   null,
//   true,
//   "Asia/Kolkata"
// );

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.set("strictQuery", true);
mongoose.connect(
  `mongodb://${config.database.host}:${config.database.port}/${config.database.db}`,
  mongooseOptions,
  (err, response) => {
    if (err) {
      console.log("Database Connection Error", err.message);
    } else {
      // console.log('Connected to ', response);  useFindAndModify: false,
    }
  }
);

// let tenantDB;
// app.use(async (req, res, next) => {
//   if (req.headers.id) {
//     tenantDB = mongoose.createConnection(
//       `mongodb://127.0.0.1:27017/lynns-roshnroys-${req.headers.id}`,
//       mongooseOptions
//     );
//     next();
//   } else {
//     res.status(403).json({
//       message: "Please provide a tenant's id",
//     });
//   }
// });

// module.exports = { tenantDB };

app.post("/tenant", async (req, res) => {
  const tenantRecord = await tenantDB
    .model("tenant", tenantModel)
    .create(req.body);
  res.status(200).json(tenantRecord);
});

const db = mongoose.connection;
db.once("open", () => {
  console.log(
    `<< ************* ${process.env.NODE_ENV} database connected ************* >>`
  );
});

app.use("/testConnection", (req, res) => {
  res.json("CONNECTED SUCCESSFULLY...");
});
const auth = require("./api/auth/routes/auth.route");
app.use("/auth", auth);

const dashboard = require("./api/dashboard/routes/dashboard.route");
app.use("/dashboard", jwtmiddleware.jwtauth, dashboard);

const products = require("./api/products/routes/products.route");
app.use("/products", jwtmiddleware.jwtauth, products);

const customers = require("./api/customers/routes/customers.route");
app.use("/customers", jwtmiddleware.jwtauth, customers);

const delivery_challans = require("./api/delivery_challans/routes/delivery_challans.route");
app.use("/delivery_challans", jwtmiddleware.jwtauth, delivery_challans);

const credit_note = require("./api/credit_note/routes/credit_note.route");
app.use("/credit_note", jwtmiddleware.jwtauth, credit_note);

const purchase_orders = require("./api/purchase_orders/routes/purchase_orders.route");
app.use("/purchase_orders", jwtmiddleware.jwtauth, purchase_orders);

const debit_note = require("./api/debit_note/routes/debit_note.route");
app.use("/debit_note", jwtmiddleware.jwtauth, debit_note);

const expense = require("./api/expense/routes/expense.route");
app.use("/expense", jwtmiddleware.jwtauth, expense);

const vendor = require("./api/vendor/routes/vendor.route");
app.use("/vendor", jwtmiddleware.jwtauth, vendor);

const invoice = require("./api/invoice/routes/invoice.route");
app.use("/invoice", jwtmiddleware.jwtauth, invoice);

const inventory = require("./api/inventory/routes/inventory.route");
app.use("/inventory", jwtmiddleware.jwtauth, inventory);

const units = require("./api/units/routes/unit_type.route");
app.use("/units", jwtmiddleware.jwtauth, units);

const staff = require("./api/staff/routes/staff.route");
app.use("/staff", jwtmiddleware.jwtauth, staff);

const tax = require("./api/tax/routes/tax.route");
app.use("/tax", jwtmiddleware.jwtauth, tax);

const currency = require("./api/currency/routes/currency.route");
app.use("/currency", currency);

const users = require("./api/users/routes/users.route");
app.use("/users", jwtmiddleware.jwtauth, users);

const manage_users = require("./api/manage_users/routes/manage_users.route");
app.use("/manage_users", jwtmiddleware.jwtauth, manage_users);

const category = require("./api/category/routes/category.route");
app.use("/category", jwtmiddleware.jwtauth, category);

const reports = require("./api/reports/routes/reports.route");
app.use("/reports", jwtmiddleware.jwtauth, reports);

const stripe = require("./api/stripe/routes/stripe.route");
app.use("/stripe", stripe);

const roles = require("./api/role/routes/roles.route");
app.use("/roles", jwtmiddleware.jwtauth, roles);

const paypal = require("./api/paypal/routes/paypal.route");
app.use("/paypal", paypal);

const ledger = require("./api/ledger/routes/ledger.route");
app.use("/ledger", jwtmiddleware.jwtauth, ledger);

const bankSetting = require("./api/bank_settings/routes/bankSetting.route");
app.use("/bankSettings", jwtmiddleware.jwtauth, bankSetting);

const emailSetting = require("./api/email_settings/routes/email_settings.route");
app.use("/emailSettings", jwtmiddleware.jwtauth, emailSetting);

const prefernceSetting = require("./api/preference_settings/routes/preference_settings.route");
app.use("/preferenceSettings", jwtmiddleware.jwtauth, prefernceSetting);

const paymentSetting = require("./api/paymentSettings/routes/paymentSettings.route");
app.use("/paymentSettings", jwtmiddleware.jwtauth, paymentSetting);

const companySetting = require("./api/companySettings/routes/companySetting.route");
app.use("/companySettings", jwtmiddleware.jwtauth, companySetting);

const invoiceSetting = require("./api/invoiceSettings/routes/invoiceSettings.route");
app.use("/invoiceSettings", jwtmiddleware.jwtauth, invoiceSetting);

const notificationSetting = require("./api/notificationSettings/routes/notificationSettings.route");
app.use("/notificationSettings", jwtmiddleware.jwtauth, notificationSetting);

const purchase = require("./api/purchases/routes/purchase.route");
app.use("/purchases", jwtmiddleware.jwtauth, purchase);

const payment = require("./api/payment/routes/payment.route");
app.use("/payment", jwtmiddleware.jwtauth, payment);

const quotation = require("./api/quotation/routes/quotation.route");
app.use("/quotation", jwtmiddleware.jwtauth, quotation);

const notification = require("./api/notification/routes/notification.route");
app.use("/notification", jwtmiddleware.jwtauth, notification);

const permission = require("./api/permissions/routes/permission.route");
app.use("/permission", jwtmiddleware.jwtauth, permission);

const dropDown = require("./api/drop_down_list/routes/drop_down_list.route");
app.use("/drop_down", jwtmiddleware.jwtauth, dropDown);

const unauthorizedAPI = require("./api/unauthorized_apis/routes/unauthorized_apis.route");
app.use("/unauthorized", unauthorizedAPI);

const signature = require("./api/signature/routes/signature.route");
app.use("/signature", jwtmiddleware.jwtauth, signature);

const invoiceTemplate = require("./api/templates/invoice_template/routes/invoice_templates.route");
app.use("/invoiceTemplate", jwtmiddleware.jwtauth, invoiceTemplate);

const purchaseTemplate = require("./api/templates/purchase_template/routes/purchase_template.route");
app.use("/purchaseTemplate", jwtmiddleware.jwtauth, purchaseTemplate);

const purchaseOrderTemplate = require("./api/templates/purchase_order_template/routes/purchaseOrd_template.route");
app.use("/purchaseOrderTemplate", jwtmiddleware.jwtauth, purchaseOrderTemplate);

const quotationTemplate = require("./api/templates/quotation_template/routes/quotation_template.route");
app.use("/quotationTemplate", jwtmiddleware.jwtauth, quotationTemplate);

const salesReturnTemplate = require("./api/templates/sales_return_template/routes/salesReturn_template.route");
app.use("/salesReturnTemplate", jwtmiddleware.jwtauth, salesReturnTemplate);

const purchaseReturnTemplate = require("./api/templates/purchase_return_template/routes/purchaseReturn_template.route");
app.use(
  "/purchaseReturnTemplate",
  jwtmiddleware.jwtauth,
  purchaseReturnTemplate
);

// const tenant = require("./api/tenant/routes/tenant.route");
// app.use("/tenant", tenant);
