const response = require("../../../response");
const verify = require("../../../verify.token");
const transactionModel = require("../../stripe/models/transactions.model");
const paymentModel = require("../../payment/models/payment.model");
const invoiceModel = require("../../invoice/models/invoice.model");
const customerModel = require("../../customers/models/customers.model");
const paypalConfig = require("../../../config/paypal.json");
const paymentSettingsModel = require("../../paymentSettings/models/paymnentSettings.model");
const braintree = require("braintree");
const paypal = require("paypal-rest-sdk");
const mongoose = require("mongoose");
const fetch = require("node-fetch-commonjs");
const fs = require("fs");

exports.paypalTransaction = async (req, res) => {
  try {
    const paymentSettingsRecord = await paymentSettingsModel.findOne();
    const request = req.body;
    const authUser = verify.verify_token(req.headers.token).details;
    const invoiceRecord = await invoiceModel
      .findById(request.invoiceId)
      .populate("customerId")
      .lean();
    const paymentResponse = await new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: "j5zy397yf6st8bbh",
      publicKey: "7gpcnrw7n6w7dhsg",
      privateKey: "ydb186958d8e7a0144e51f59eae610e74",
    }).transaction.sale({
      amount: request.amount,
      paymentMethodNonce: request.nonce,
      options: {
        submitForSettlement: true,
      },
    });
    const transRec = await transactionModel.create({
      type: "paypal",
      customerId: invoiceRecord.customerId,
      invoiceId: request.invoiceId,
      transactionDetails: paymentResponse,
      userId: invoiceRecord.customerId,
    });
    if (paymentResponse.success) {
      let paidAmount = 0;
      const paymentRecord = await paymentModel.aggregate([
        {
          $match: {
            invoiceId: mongoose.Types.ObjectId(request.invoiceId),
          },
        },
        {
          $group: {
            _id: null,
            paidAmount: {
              $sum: "$amount",
            },
          },
        },
      ]);
      if (paymentRecord.length > 0) {
        paidAmount += parseFloat(paymentRecord[0].paidAmount);
      }
      let status = "PAID";
      if (paidAmount < parseFloat(invoiceRecord.TotalAmount)) {
        status = "PARTIALLY_PAID";
      }
      const payment = await paymentModel.create({
        invoiceId: request.invoiceId,
        invoiceAmount: invoiceRecord.TotalAmount,
        received_on: new Date(),
        payment_method: "Online",
        amount: request.amount,
        notes: "payment through paypal",
        status: status,
        userId: invoiceRecord.customerId,
      });
      const updatedInvoiceRecord = await invoiceModel.findByIdAndUpdate(
        request.invoiceId,
        {
          $set: {
            status: status,
          },
        }
      );
      response.success_message(paymentResponse, res);
    } else {
      response.validation_error_message({ message: "Payment failed!" }, res);
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};

// exports.generateClientToken = async (req, res) => {
//   try {
//     const paymentResponse = await new braintree.BraintreeGateway({
//       environment: braintree.Environment.Sandbox,
//       merchantId: "j5zy397yf6st8bbh",
//       publicKey: "7gpcnrw7n6w7dhsg",
//       privateKey: "ydb186958d8e7a0144e51f59eae610e74",
//     }).clientToken.generate({
//       options: {
//         threeDSecure: {
//           amount: req.body.amount,
//         },
//       },
//     });
//     response.success_message(paymentResponse, res);
//   } catch (error) {
//     response.error_message(error.message, res);
//   }
// };

exports.executePayment = async (req, res) => {
  try {
    const request = {
      payer_id: req.body.payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: req.body.amount,
          },
        },
      ],
    };
    const payment = await paypal.payment.execute(req.body.paymentId, request);
    console.log("payment :", payment);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.createPayment = async (req, res) => {
  try {
    const request = req.body;
    // paypal.configure({
    //   mode: "sandbox",
    //   client_id: "YOUR_CLIENT_ID",
    //   client_secret: "YOUR_CLIENT_SECRET",
    // });
    // const paymentData = {
    //   intent: "sale",
    //   payer: {
    //     payment_method: "paypal",
    //   },
    //   transactions: [
    //     {
    //       amount: {
    //         total: req.body.amount,
    //         currency: "USD",
    //       },
    //     },
    //   ],
    //   redirect_urls: {
    //     return_url: "http://localhost:3001/execute-payment",
    //     cancel_url: "http://localhost:3001/cancel-payment",
    //   },
    // };
    // const payment = await paypal.payment.create(paymentData);
    // const approvalURL = await payment.links.find(
    //   (link) => link.rel === "approval_url"
    // ).href;
    const invoiceRecord = await invoiceModel
      .findById(request.invoiceId)
      .populate("customerId")
      .lean();
    const transRec = await transactionModel.create({
      type: "paypal",
      customerId: invoiceRecord.customerId,
      invoiceId: request.invoiceId,
      transactionDetails: request.paymentResponse,
      userId: invoiceRecord.customerId,
    });
    if (request.status == "COMPLETED") {
      let paidAmount = 0;
      const paymentRecord = await paymentModel.aggregate([
        {
          $match: {
            invoiceId: mongoose.Types.ObjectId(request.invoiceId),
          },
        },
        {
          $group: {
            _id: null,
            paidAmount: {
              $sum: "$amount",
            },
          },
        },
      ]);
      if (paymentRecord.length > 0) {
        paidAmount += parseFloat(paymentRecord[0].paidAmount);
      }
      let status = "PAID";
      if (paidAmount < parseFloat(invoiceRecord.TotalAmount)) {
        status = "PARTIALLY_PAID";
      }
      const payment = await paymentModel.create({
        invoiceId: request.invoiceId,
        invoiceAmount: invoiceRecord.TotalAmount,
        received_on: new Date(),
        payment_method: "Online",
        amount: request.amount,
        notes: "payment through paypal",
        status: status,
        userId: invoiceRecord.customerId,
      });
      const updatedInvoiceRecord = await invoiceModel.findByIdAndUpdate(
        request.invoiceId,
        {
          $set: {
            status: status,
          },
        }
      );
      response.success_message(updatedInvoiceRecord, res);
    }
  } catch (error) {
    response.error_message(error.message, res);
  }
};
const base = "https://api-m.sandbox.paypal.com";

exports.createOrder = async (req, res) => {
  try {
    const purchaseAmount = req.body.amount;
    const accessToken = await this.generateAccessToken(req, res);

    const url = `${base}/v2/checkout/orders`;
    const result = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: purchaseAmount,
            },
            paymentDetails: {
              invoiceId: req.body.invoiceId,
            },
          },
        ],
      }),
    });
    const jsonResult = await result.json();
    return response.success_message(jsonResult, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.generateAccessToken = async (req, res) => {
  try {
    let CLIENT_ID = "";
    let APP_SECRET = "";
    const paymentSettingsRecord = await paymentSettingsModel.findOne().lean();
    if (paymentSettingsRecord.paypal_account_type == "SANDBOX") {
      CLIENT_ID = paymentSettingsRecord.sandbox_paypalClientId;
      APP_SECRET = paymentSettingsRecord.sandbox_paypalSecret;
    } else {
      CLIENT_ID = paymentSettingsRecord.paypalClientId;
      APP_SECRET = paymentSettingsRecord.paypalSecret;
    }
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const result = await response.json();
    return result.access_token;
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.generateClientToken = async (req, res) => {
  try {
    const accessToken = await this.generateAccessToken(req, res);
    const result = await fetch(`${base}/v1/identity/generate-token`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "en_US",
        "Content-Type": "application/json",
      },
    });
    const jsonResult = await result.json();
    console.log("response", jsonResult.status);
    response.success_message(jsonResult, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.capturePayment = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const accessToken = await this.generateAccessToken(req, res);
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const result = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonResult = await result.json();
    console.log("jsonResult :", jsonResult);
    response.success_message(jsonResult, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};

exports.paypalWebhook = async (req, res) => {
  try {
    const request = req.body;
    console.log("request :", request);
    fs.writeFileSync("./paypalWebhook.json", JSON.stringify(request));
    const invoiceRecord = await invoiceModel
      .findById(request.resource.purchase_units[0].paymentDetails.invoiceId)
      .populate("customerId")
      .lean();
    const transRec = await transactionModel.create({
      type: "paypal",
      customerId: invoiceRecord.customerId._id,
      invoiceId: request.resource.purchase_units[0].paymentDetails.invoiceId,
      transactionDetails: request,
      userId: invoiceRecord.customerId._id,
    });
    if (request.status == "COMPLETED") {
    }
    let paidAmount = 0;
    const paymentRecord = await paymentModel.aggregate([
      {
        $match: {
          invoiceId: mongoose.Types.ObjectId(
            request.resource.purchase_units[0].paymentDetails.invoiceId
          ),
        },
      },
      {
        $group: {
          _id: null,
          paidAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    if (paymentRecord.length > 0) {
      paidAmount += parseFloat(paymentRecord[0].paidAmount);
    }
    let status = "PAID";
    if (paidAmount < parseFloat(invoiceRecord.TotalAmount)) {
      status = "PARTIALLY_PAID";
    }
    const payment = await paymentModel.create({
      invoiceId: request.resource.purchase_units[0].paymentDetails.invoiceId,
      invoiceAmount: invoiceRecord.TotalAmount,
      received_on: new Date(),
      payment_method: "Online",
      amount: request.amount,
      notes: "payment through paypal",
      status: status,
      userId: invoiceRecord.customerId,
    });
    const updatedInvoiceRecord = await invoiceModel.findByIdAndUpdate(
      request.resource.purchase_units[0].paymentDetails.invoiceId,
      {
        $set: {
          status: status,
        },
      }
    );
  } catch (error) {
    response.error_message(error.message, res);
  }
};
