const moment = require("moment");
// const fs = require("fs");
// const crypto = require("./crypto");
const cryptojs = require("crypto-js");

// const dot = "23 06 2023";

// let regPattern = new RegExp(" ", "g");
// console.log("dot:", dot.replace(regPattern, "-"));

// const curryingFunction = (a) => {
//   return (b) => {
//     return (c) => {
//       return console.log(a * b * c);
//     };
//   };
// };

// // curryingFunction(2)(3)(4);
// const searchTerm = "tamil";
// const regexPattern = new RegExp(
//   [...searchTerm.replace(/\s/g, "")].join(".*"),
//   "i"
// );

// console.log("result:", regexPattern.test("Ta m il")); // Output: true

// const code = "group\\s?1";

// console.log(moment("19/11/2023", "DD/MM/YYYY").add(330, "minutes").toDate());
// console.log(new Date());

// fs.writeFileSync("./test.txt", "test string");

// const array = [1, 3, 4, 5, 67];

// for (const item of array) {
//   console.log("item :", item);
// }

// const enc_data = crypto.encrypt(
//   JSON.stringify(JSON.stringify({ name: "tamil" }))
// );
// console.log(enc_data);

// const decrypt = crypto.decrypt(enc_data);
// console.log("object :", decrypt);

//const testFile = cryptojs.AES.encrypt(
//   JSON.stringify({ name: "test", value: 20 }),
//   "secret_key"
// ).toString();
// console.log("testFile :", testFile);
// const decrypt = cryptojs.AES.decrypt(testFile, "secret_key").toString(
//   cryptojs.enc.Utf8
// );

// console.log("decrypt :", decrypt);

// const aesEncryption = cryptojs.SHA256("tamilarasan").toString();
// const aesDecription = cryptojs
//   .SHA256(aesEncryption)
//   .toString(cryptojs.enc.Utf8);
// console.log("aesEncryption :", aesEncryption);
// console.log("aesDecription :", aesDecription);

// cryptojs.r;
// const crypto = require("crypto");
// const randomNo = crypto.randomBytes(32).toString("hex");
// // console.log("randomNo :", randomNo);
// message = JSON.stringify({
//   _id: "64a50c4f8cf3ee60b9cf013e",
//   invoiceNumber: " 000025",
//   customerId: "6493e98e2ad170f373cf7b23",
//   invoiceDate: "05/07/2023",
//   dueDate: "2023-05-06T18:30:00.000Z",
//   renewalDates: [],
//   status: "PARTIALLY_PAID",
//   referenceNo: "234353535",
//   isRecurringCancelled: false,
//   isRecurring: false,
//   recurringCycle: "0",
//   items: [
//     {
//       name: "ProductB",
//       key: "0",
//       productId: "649141e2435bf8c00eb5ae4a",
//       quantity: "1",
//       units: "unit1",
//       unit: "648c2422d0c1c50a1fb7b7c3",
//       rate: "200.00",
//       discount: "10.00",
//       tax: "9.50",
//       taxInfo:
//         '{"_id":"648c24a9d0c1c50a1fb7b7df","name":"tax-1","taxRate":"5","status":true,"type":"1","userId":"648c1662d0c1c50a1fb7b720","isDeleted":false,"createdAt":"2023-06-16T09:00:25.206Z","updatedAt":"2023-06-21T09:39:55.028Z","__v":0}',
//       amount: "199.50",
//       discountType: "3",
//       isRateFormUpadted: "false",
//       form_updated_discounttype: "3",
//       form_updated_discount: "10.00",
//       form_updated_rate: "200.00",
//       form_updated_tax: "5.00",
//     },
//   ],
//   taxableAmount: "200.00",
//   totalDiscount: "10.00",
//   vat: "9.50",
//   roundOff: true,
//   TotalAmount: "200.00",
//   bank: "6494551765886dc955a48d75",
//   notes: "dmcwkemc",
//   termsAndCondition: "wcevcmvr",
//   signatureName: "wcwevcrer",
//   signatureImage:
//     "uploads\\invoices\\signatureImage-1688538191305-134562065.jpg",
//   isDeleted: false,
//   isCloned: false,
//   isSalesReturned: false,
//   userId: "64a3e4b72d55066dbd0d77b0",
//   createdAt: "2023-07-05T06:23:11.448Z",
//   updatedAt: "2023-07-05T14:11:54.397Z",
//   __v: 0,
// });
// var key = "6Le0DgMTAAAAAN";
// var iv = "mHGFxENnZLbie";
// var cipherData = cryptojs.AES.encrypt(message, key, { iv: iv }).toString();
// console.log("object :", cipherData);

// const startDate = moment(new Date()).startOf("day").toDate();
// const EndDate = moment(new Date()).endOf("day").toDate();
// console.log("endDate :", EndDate);
// console.log("startDate :", startDate);

// const mongoose = require("mongoose");

// const getStartAndEndDates = (startDate, endDate) => {
//   const startOfStartDate = new Date(startDate);
//   const endOfEndDate = new Date(endDate);

//   startOfStartDate.setHours(0, 0, 0, 0);

//   endOfEndDate.setHours(23, 59, 59, 999);

//   return {
//     start: startOfStartDate,
//     end: endOfEndDate,
//   };
// };

// const startDate = new Date("2023-07-28");
// const endDate = new Date("2023-08-05");
// const result = getStartAndEndDates(startDate, endDate);

// console.log(result.start.toISOString());
// console.log(result.end.toISOString());

// const customerModel = require("./api/customers/models/customers.model");

// const dateModule = require("./api/common/date");

// const week = dateModule.getStartAndEndDate("week");

// (async () => {
//   const customerRecords = await customerModel.aggregate([
//     {
//       $facet: {
//         thisweek: [
//           {
//             $match: {
//               createdAt: {
//                 $gte: week.from_date,
//                 $lte: week.to_date,
//               },
//             },
//           },
//           { $count: "count" },
//         ],
//         lastweek: [
//           {
//             $match: {
//               createdAt: {
//                 $gte: week.lastWeekFromDate,
//                 $lte: week.lastWeekToDate,
//               },
//             },
//           },
//           { $count: "count" },
//         ],
//       },
//     },
//   ]);
//   console.log(customerRecords);
// })();

// let test = "";

// if (test) {
//   console.log("true");
// }

// const mongoose = require("mongoose");
// const schemaTypes = {
//   string: mongoose.SchemaTypes.String,
//   number: mongoose.SchemaTypes.Number,
//   checkbox: mongoose.SchemaTypes.Boolean,
//   togglebutton: mongoose.SchemaTypes.Boolean,
// };
// //console.log("schemaTypes[string] :", schemaTypes["string"]);

// let mySchema = new mongoose.Schema({});

// mySchema.add({
//   fieldName: {
//     type: schemaTypes["checkbox"],
//     required: true,
//   },
//   fieldName1: {
//     type: mongoose.SchemaTypes.Boolean,
//     required: true,
//   },
// });

// console.log("mySchema :", mySchema);

const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 5 },
  { name: "fish", type: "meat", quantity: 22 },
];

// const result = Object.groupById(inventory, ({ type }) => type);

// console.log("result :", result);

// const products = [
//   { name: "Laptop", category: "electronics" },
//   { name: "apples", category: "fruits" },
//   { name: "oranges", category: "fruits" },
//   { name: "potatoes", category: "vegetables" },
//   { name: "mobile", category: "electronics" },
// ];

// var result = products.reduce((x, y) => {
//   console.log("x :", x);
//   console.log("y :", y);
//   (x[y.category] = x[y.category] || []).push(y);
//   return x;
// }, {});

// console.log(result);
