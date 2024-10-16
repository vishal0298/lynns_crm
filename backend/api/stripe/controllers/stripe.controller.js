const response = require("../../../response");
const transactionModel = require("./../models/transactions.model");
const verify = require("../../../verify.token");
const invoiceModel = require("../../invoice/models/invoice.model");
const paymentModel = require("../../payment/models/payment.model");
const customerModel = require("../../customers/models/customers.model");
const fs = require("fs");
const notification = require("../../notification/controllers/notification.controller");
const notificationModel = require("../../notification/models/notification.model");
const mongoose = require("mongoose");
const userModel = require("../../auth/models/auth.model");
const paymentSettingsModel = require("../../paymentSettings/models/paymnentSettings.model");

exports.stripePaymentProcess = async (req, res) => {
  try {
    const invoiceRecord = await invoiceModel
      .findOne({
        _id: req.body.invoiceId,
        status: { $ne: "PAID" },
      })
      .populate("customerId");
    if (invoiceRecord) {
      const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
      let secretKey = "";
      if (paymentSettingsRecord.stripe_account_type == "SANDBOX") {
        secretKey = paymentSettingsRecord.sandbox_stripeSecretKey;
      } else {
        secretKey = paymentSettingsRecord.stripeSecretKey;
      }
      const stripe = require("stripe")(secretKey);
      const auth_user = verify.verify_token(req.headers.token).details;
      const customer = await stripe.customers.create({
        email: invoiceRecord.customerId.email,
        name: invoiceRecord.customerId.name,
      });
      const charges = await stripe.paymentIntents.create({
        payment_method: req.body.paymentMethodId,
        amount: req.body.amount * 100,
        description: "Invoice payment",
        currency: 'INR',
        customer: customer.id,
        shipping: {
          name: invoiceRecord.customerId.name,
          address: {
            line1: invoiceRecord.customerId.shippingAddress.addressLine1,
            postal_code: invoiceRecord.customerId.shippingAddress.pincode,
            city: invoiceRecord.customerId.shippingAddress.city,
            state: invoiceRecord.customerId.shippingAddress.state,
            country: "IN",
          },
        },
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        metadata: { invoiceId: req.body.invoiceId },
      });
      
      response.success_message(charges.client_secret, res);
    } else {
      response.validation_error_message(
        { message: "invoice already paid" },
        res
      );
    }
  } catch (error) {
    console.log("error :", error);
    response.error_message(error, res);
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
    let secretKey = "";
    if (paymentSettingsRecord.stripe_account_type == "SANDBOX") {
      secretKey = paymentSettingsRecord.sandbox_stripeSecretKey;
    } else {
      secretKey = paymentSettingsRecord.stripeSecretKey;
    }
    const stripe = require("stripe")(secretKey);
    const paymentIntent = await stripe.paymentIntents.confirm(
      req.body.paymentIntentId,
      {
        return_url: "https://example.com/return_url",
      }
    );
    if (paymentIntent.status == "Success") {
      const customerName = await customerModel.findById(request.customerId);
      const adminRole = await users.findOne({ role: "Super Admin" });

      if (adminRole) {
        await notification.sendFCMMessage(
          {
            title: "Notification Message",
            body: `Payment done By ${customerName.name}`,
          },
          [adminRole._id]
        );
      } else {
        response.error_message(error, res);
      }
    }
  response.success_message(paymentIntent, res);
  } catch (error) {
    console.log("error :", error);
    response.error_message(error, res);
  }
};

exports.stripeWebhookPayment = async (req, res) => {

const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
  let secretKey = "";
  if (paymentSettingsRecord.stripe_account_type == "SANDBOX") {
    secretKey = paymentSettingsRecord.sandbox_stripeSecretKey;
  } else {
    secretKey = paymentSettingsRecord.stripeSecretKey;
  }
  const stripe = require("stripe")(secretKey);
  const request = req.body;
  
  try {
    const retriveIntent = await stripe.paymentIntents.retrieve(
      request.data.id
    );
    const invoiceRecord = await invoiceModel.findById(
      retriveIntent.metadata.invoiceId
    );
    if (invoiceRecord.status !== "PAID") {
      const customerRecord = await customerModel.findById(
        invoiceRecord.customerId
      );
      const tranRes = await transactionModel.create({
        customerId: customerRecord._id,
        invoiceId: retriveIntent.metadata.invoiceId,
        type: "stripe",
        transactionDetails: retriveIntent,
        userId: customerRecord._id,
      });
      fs.writeFileSync("./stripeWebhook.json", JSON.stringify(request));
      if (fs.existsSync("./stripeWebhook.json")) {
        if (retriveIntent.status == "succeeded") {
          const payment = await paymentModel.create({
            invoiceId: retriveIntent.metadata.invoiceId,
            invoiceAmount: invoiceRecord.TotalAmount,
            received_on: new Date(),
            payment_method: "Online",
            amount: retriveIntent.amount / 100,
            notes: "payment through stripe",
            status: retriveIntent.status,
            userId: invoiceRecord.customerId,
          });
          const updatedInvoiceRecord = await invoiceModel.findByIdAndUpdate(
            retriveIntent.metadata.invoiceId,
            {
              $set: {
                status: "PAID",
              },
            },
            { new: true }
          );
          const adminRole = await userModel.findOne({ role: "Super Admin" });
          await notification.sendFCMMessage(
            {
              title: "Notification Message",
              body: `Payment done By ${customerRecord.name}`,
            },
            [adminRole._id]
          );
        }
        const msg = { message: "Payment successful." };

        response.success_message(msg, res);

      } else {
        response.validation_error_message(
          { message: "file is not created" },
          res
        );
      }
    }
  } catch (error) {
    console.log("error :", error);
  }
}

exports.stripeWebhook = async (req, res) => {
  const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
  let secretKey = "";
  if (paymentSettingsRecord.stripe_account_type == "SANDBOX") {
    secretKey = paymentSettingsRecord.sandbox_stripeSecretKey;
  } else {
    secretKey = paymentSettingsRecord.stripeSecretKey;
  }
  const stripe = require("stripe")(secretKey);
  const request = req.body;
  try {
    const retriveIntent = await stripe.paymentIntents.retrieve(
      request.data.object.id
    );
    const invoiceRecord = await invoiceModel.findById(
      retriveIntent.metadata.invoiceId
    );
    if (invoiceRecord.status !== "PAID") {
      const customerRecord = await customerModel.findById(
        invoiceRecord.customerId
      );
      const tranRes = await transactionModel.create({
        customerId: customerRecord._id,
        invoiceId: retriveIntent.metadata.invoiceId,
        type: "stripe",
        transactionDetails: retriveIntent,
        userId: customerRecord._id,
      });
      fs.writeFileSync("./stripeWebhook.json", JSON.stringify(request));
      if (fs.existsSync("./stripeWebhook.json")) {
        if (retriveIntent.status == "succeeded") {
          const payment = await paymentModel.create({
            invoiceId: retriveIntent.metadata.invoiceId,
            invoiceAmount: invoiceRecord.TotalAmount,
            received_on: new Date(),
            payment_method: "Online",
            amount: retriveIntent.amount / 100,
            notes: "payment through stripe",
            status: retriveIntent.status,
            userId: invoiceRecord.customerId,
          });
          const updatedInvoiceRecord = await invoiceModel.findByIdAndUpdate(
            retriveIntent.metadata.invoiceId,
            {
              $set: {
                status: "PAID",
              },
            },
            { new: true }
          );
          const adminRole = await userModel.findOne({ role: "Super Admin" });
          await notification.sendFCMMessage(
            {
              title: "Notification Message",
              body: `Payment done By ${customerRecord.name}`,
            },
            [adminRole._id]
          );
        }
      } else {
        response.validation_error_message(
          { message: "file is not created" },
          res
        );
      }
    }
  } catch (error) {
    console.log("error :", error);
  }
};
