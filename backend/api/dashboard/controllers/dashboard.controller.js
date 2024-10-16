const response = require("../../../response");
const invoiceModel = require("../../invoice/models/invoice.model");
const customerModel = require("../../customers/models/customers.model");
const quotationModel = require("../../quotation/models/quotation.model");
const paymentModel = require("../../payment/models/payment.model");
const date = require("../../common/date");
const verify = require("../../../verify.token");
const moment = require("moment");
var mongoose = require("mongoose");

// ==================== main ======================= //

// exports.dashboard = async (req, res) => {
//   try {
//     let data = {
//       customers: 0,
//       invoices: 0,
//       estimates: 0,
//       amountDue: 0,
//       customerPercentage: {},
//       quotationPercentage: {},
//       invoicedPercentage: {},
//       amountDuePercentage: {},
//       invoiceList: [],
//       series: [1, 0],
//       labels: ["Paid", "Draft"],
//       legend: { show: false },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 200,
//             },
//             legend: {
//               position: "bottom",
//             },
//           },
//         },
//       ],
//     };
//     const week = date.getStartAndEndDate("week");
//     const customerRecords = await customerModel.aggregate([
//       {
//         $facet: {
//           totalCustomersCount: [
//             { $match: { isDeleted: false } },
//             { $count: "count" },
//           ],
//           thisweek: [
//             {
//               $match: {
//                 createdAt: {
//                   $gte: week.from_date,
//                   $lte: week.to_date,
//                 },
//               },
//             },
//             { $count: "count" },
//           ],
//           lastweek: [
//             {
//               $match: {
//                 createdAt: {
//                   $gte: week.lastWeekFromDate,
//                   $lte: week.lastWeekToDate,
//                 },
//               },
//             },
//             { $count: "count" },
//           ],
//         },
//       },
//     ]);
//     const quotationRecords = await quotationModel.aggregate([
//       {
//         $facet: {
//           totalEstimationsCount: [
//             {
//               $match: {
//                 isDeleted: false,
//               },
//             },
//             { $count: "count" },
//           ],
//           thisweek: [
//             {
//               $match: {
//                 isDeleted: false,
//                 createdAt: {
//                   $gte: week.from_date,
//                   $lte: week.to_date,
//                 },
//               },
//             },
//             { $count: "count" },
//           ],
//           lastweek: [
//             {
//               $match: {
//                 isDeleted: false,
//                 createdAt: {
//                   $gte: week.lastWeekFromDate,
//                   $lte: week.lastWeekToDate,
//                 },
//               },
//             },
//             { $count: "count" },
//           ],
//         },
//       },
//     ]);
//     const lastWeekCustomerCount =
//       customerRecords[0].lastweek.length > 0
//         ? customerRecords[0].lastweek[0].count
//         : 0;
//     const currentWeekCustomerCount =
//       customerRecords[0].thisweek.length > 0
//         ? customerRecords[0].thisweek[0].count
//         : 0;
//     data.customerPercentage = this.PercentageCalculation(
//       currentWeekCustomerCount,
//       lastWeekCustomerCount
//     );
//     const lastWeekQuotationCount =
//       quotationRecords[0].lastweek.length > 0
//         ? quotationRecords[0].lastweek[0].count
//         : 0;
//     const currentWeekQuotationCount =
//       quotationRecords[0].thisweek.length > 0
//         ? quotationRecords[0].thisweek[0].count
//         : 0;

//     data.quotationPercentage = this.PercentageCalculation(
//       currentWeekQuotationCount,
//       lastWeekQuotationCount
//     );
//     const invoicedPercentage = await this.invoicePercentageCalculation();
//     data.invoicedPercentage = invoicedPercentage.invoiced;
//     data.amountDuePercentage = invoicedPercentage.dueAmount;
//     data.customers =
//       customerRecords[0].totalCustomersCount.length > 0
//         ? customerRecords[0].totalCustomersCount[0].count
//         : 0;
//     let invoiceRecords = await invoiceModel
//       .find({ isDeleted: false,isSalesReturned:false })
//       .populate("customerId")
//       .sort({ _id: -1 })
//       .lean();
//     for (const invoice of invoiceRecords) {
//       if (
//         invoice.customerId &&
//         invoice.customerId.image &&
//         !invoice.customerId.image.startsWith("http")
//       ) {
//         invoice.customerId.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${invoice.customerId.image}`;
//       }
//     }
//     data.invoices = invoiceRecords;

//     data.estimates =
//       quotationRecords[0].totalEstimationsCount.length > 0
//         ? quotationRecords[0].totalEstimationsCount[0].count
//         : 0;
//     data.invoiceList = data.invoices;
//     data.invoices = data.invoices.length;
//     for (const item of data.invoiceList) {
//       if (
//         item.dueDate < new Date() &&
//         item.status !== "PAID" &&
//         item.status !== "PARTIALLY_PAID" &&
//         item.status !== "SENT"
//       ) {
//         item.status = "OVERDUE";
//       }
//     }
//     data.invoiceList.splice(10);

//     let paidRecs = 0;
//     let draftRecs = 0;
//     let overDueRecs = 0;
//     let partiallyPaidRecs = 0;
//     let invoiced = 0;
//     let received = 0;
//     let pending = 0;
//     let draftedAmt = 0;
//     let paidAmt = 0;
//     let partiallyPaidAmt = 0;
//     let overdueAmt = 0;

//     let invoiceRec;
//     let invoiceRecNo;

//     const { type } = req.query;
//     let fromDate, toDate;

//     const dates = date.getStartAndEndDate(req.query.type);
//     let baseFilter = {};

//     let filter = {};
//     filter.invoiceDate = {
//       $gte: dates.from_date,
//       $lte: dates.to_date,
//     };
//     filter.isSalesReturned=false;
//     baseFilter.isSalesReturned=false;

//     if (type === "week") {
//       invoiceRec = await invoiceModel.find(filter);
//       invoiceRecNo = invoiceRec.length;
//     } else if (type === "month") {
//       invoiceRec = await invoiceModel.find(filter);
//       invoiceRecNo = invoiceRec.length;
//     } else if (type === "year") {
//       invoiceRec = await invoiceModel.find(filter);
//       invoiceRecNo = invoiceRec.length;
//     } else {
//       invoiceRec = await invoiceModel.find(baseFilter);
//       invoiceRecNo = invoiceRec.length;
//     }
    
//     const arrayStatus = ["PAID"];
//     if (Array.isArray(invoiceRec)) {
//       for (const item of invoiceRec) {
//         if (item.isDeleted === false) {
//           if (item.status === "PAID") {
//             paidRecs += 1;
//             received += parseFloat(item.TotalAmount);
//             invoiced += parseFloat(item.TotalAmount);
//             paidAmt += parseFloat(item.TotalAmount);
//           } else if (item.status === "PARTIALLY_PAID") {
//             partiallyPaidRecs += 1;
//             const paymentRec = await paymentModel.aggregate([
//               {
//                 $match: {
//                   invoiceId: mongoose.Types.ObjectId(item._id),
//                 },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   paidAmount: {
//                     $sum: "$amount",
//                   },
//                 },
//               },
//             ]);
//             let paidAmount =
//               paymentRec.length > 0 ? paymentRec[0].paidAmount : 0;
//             pending += parseFloat(item.TotalAmount) - paidAmount;
//             invoiced += parseFloat(item.TotalAmount);
//             received += parseFloat(paidAmount);
//             partiallyPaidAmt += paidAmount;
//           } else if (
//             item.dueDate < new Date() &&
//             !arrayStatus.includes(item.status)
//           ) {
//             overDueRecs += 1;
//             pending += parseFloat(item.TotalAmount);
//             invoiced += parseFloat(item.TotalAmount);
//             overdueAmt += parseFloat(item.TotalAmount);
//           } else {
//             draftRecs += 1;
//             pending += parseFloat(item.TotalAmount);
//             invoiced += parseFloat(item.TotalAmount);
//             draftedAmt += parseFloat(item.TotalAmount);
//           }
//         }
//       }
//     }

//     data.series = [paidRecs, draftRecs, overDueRecs, partiallyPaidRecs];

//     data.labels = ["PAID", "DRAFTED", "OVERDUE", "PARTIALLY PAID"];

//     data.received = parseFloat(received);
//     data.pending = parseFloat(pending);
//     data.invoiced = parseFloat(invoiced);
//     data.amountDue = parseFloat(overdueAmt) || 0;
//     data.paidAmt = parseFloat(paidAmt);
//     data.draftedAmt = parseFloat(draftedAmt);
//     data.overdueAmt = parseFloat(overdueAmt);
//     data.partiallyPaidAmt = parseFloat(partiallyPaidAmt);
//     response.success_message(data, res);
//   } catch (error) {
//     console.log("error".error);
//     response.error_message(error.message, res);
//   }
// };

// exports.PercentageCalculation = (currentWeekCount, lastWeekCount) => {
//   let data = {
//     percentage: "",
//     value: 0,
//   };
//   if (
//     (!lastWeekCount && !currentWeekCount) ||
//     lastWeekCount == currentWeekCount
//   ) {
//     data.percentage = "nil";
//     data.value = "0 %";
//   } else if (currentWeekCount && !lastWeekCount) {
//     data.percentage = "Increased";
//     data.value = "100 %";
//   } else if (!currentWeekCount && lastWeekCount) {
//     data.percentage = "Decreased";
//     data.value = "100 %";
//   } else if (currentWeekCount > lastWeekCount) {
//     data.percentage = "Increased";
//     data.value = `${(
//       ((currentWeekCount - lastWeekCount) / lastWeekCount) *
//       100
//     ).toFixed(2)} %`;
//   } else {
//     data.percentage = "Decreased";
//     data.value = `${(
//       ((lastWeekCount - currentWeekCount) / lastWeekCount) *
//       100
//     ).toFixed(2)} %`;
//   }
//   return data;
// };

// exports.invoicePercentageCalculation = async () => {
//   try {
//     const week = date.getStartAndEndDate("week");
//     let invoiced = {};
//     let dueAmount = {};

//     const invoiceRecords = await invoiceModel.aggregate([
//       {
//         $facet: {
//           totalInvoicesCount: [
//             { $match: { isDeleted: false } },
//             { $count: "count" },
//           ],
//           thisweek: [
//             {
//               $match: {
//                 isDeleted: false,
//                 createdAt: {
//                   $gte: week.from_date,
//                   $lte: week.to_date,
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $toDouble: "$TotalAmount" },
//                 },
//               },
//             },
//           ],
//           lastweek: [
//             {
//               $match: {
//                 isDeleted: false,
//                 createdAt: {
//                   $gte: week.lastWeekFromDate,
//                   $lte: week.lastWeekToDate,
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $toDouble: "$TotalAmount" },
//                 },
//               },
//             },
//           ],
//           thisweekDueAmount: [
//             {
//               $match: {
//                 isDeleted: false,
//                 status: { $in: ["DRAFTED", "SENT", "PARTIALLY_PAID"] },
//                 createdAt: {
//                   $gte: week.from_date,
//                   $lte: week.to_date,
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $toDouble: "$TotalAmount" },
//                 },
//               },
//             },
//           ],
//           lastweekDueAmount: [
//             {
//               $match: {
//                 isDeleted: false,
//                 status: { $in: ["DRAFTED", "SENT", "PARTIALLY_PAID"] },
//                 createdAt: {
//                   $gte: week.lastWeekFromDate,
//                   $lte: week.lastWeekToDate,
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: {
//                   $sum: { $toDouble: "$TotalAmount" },
//                 },
//               },
//             },
//           ],
//           lastweekPartiallyAmount: [
//             {
//               $match: {
//                 isDeleted: false,
//                 status: { $in: ["PARTIALLY_PAID"] },
//                 createdAt: {
//                   $gte: week.lastWeekFromDate,
//                   $lte: week.lastWeekToDate,
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "payments",
//                 localField: "_id",
//                 foreignField: "invoiceId",
//                 as: "partialPaymentsRecord",
//               },
//             },
//             {
//               $unwind: {
//                 path: "$partialPaymentsRecord",
//                 preserveNullAndEmptyArrays: true,
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: "$partialPaymentsRecord.amount" },
//               },
//             },
//           ],
//           thisweekPartiallyAmount: [
//             {
//               $match: {
//                 isDeleted: false,
//                 status: { $in: ["PARTIALLY_PAID"] },
//                 createdAt: {
//                   $gte: week.from_date,
//                   $lte: week.to_date,
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "payments",
//                 localField: "_id",
//                 foreignField: "invoiceId",
//                 as: "partialPaymentsRecord",
//               },
//             },
//             {
//               $unwind: {
//                 path: "$partialPaymentsRecord",
//                 preserveNullAndEmptyArrays: true,
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalAmount: { $sum: "$partialPaymentsRecord.amount" },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const thisweekInvoicedAmount =
//       invoiceRecords[0].thisweek.length > 0
//         ? invoiceRecords[0].thisweek[0].totalAmount
//         : 0;
//     const lastweekInvoicedAmount =
//       invoiceRecords[0].lastweek.length > 0
//         ? invoiceRecords[0].lastweek[0].totalAmount
//         : 0;

//     invoiced = this.PercentageCalculation(
//       thisweekInvoicedAmount,
//       lastweekInvoicedAmount
//     );

//     const thisweekPartiallyPaidAmount =
//       invoiceRecords[0].thisweekPartiallyAmount.length > 0
//         ? invoiceRecords[0].thisweekPartiallyAmount[0].totalAmount
//         : 0;
//     const lastweekPartiallyPaidAmount =
//       invoiceRecords[0].lastweekPartiallyAmount.length > 0
//         ? invoiceRecords[0].lastweekPartiallyAmount[0].totalAmount
//         : 0;

//     const lastweekDueAmount =
//       (invoiceRecords[0].lastweekDueAmount.length > 0
//         ? invoiceRecords[0].lastweekDueAmount[0].totalAmount
//         : 0) - lastweekPartiallyPaidAmount;
//     const thisweekDueAmount =
//       (invoiceRecords[0].thisweekDueAmount.length > 0
//         ? invoiceRecords[0].thisweekDueAmount[0].totalAmount
//         : 0) - thisweekPartiallyPaidAmount;

//     dueAmount = this.dueAmountPercentage(thisweekDueAmount, lastweekDueAmount);

//     return { invoiced, dueAmount };
//   } catch (error) {
//     return error;
//   }
// };

// exports.dueAmountPercentage = (currentWeekCount, lastWeekCount) => {
//   let data = {
//     percentage: "",
//     value: 0,
//   };
//   if (
//     (!lastWeekCount && !currentWeekCount) ||
//     lastWeekCount == currentWeekCount
//   ) {
//     data.percentage = "nil";
//     data.value = "0 %";
//   } else if (currentWeekCount && !lastWeekCount) {
//     data.percentage = "Decreased";
//     data.value = "100 %";
//   } else if (!currentWeekCount && lastWeekCount) {
//     data.percentage = "Increased";
//     data.value = "100 %";
//   } else if (currentWeekCount > lastWeekCount) {
//     data.percentage = "Decreased";
//     data.value = `${(
//       ((currentWeekCount - lastWeekCount) / lastWeekCount) *
//       100
//     ).toFixed(2)} %`;
//   } else {
//     data.percentage = "Increased";
//     data.value = `${(
//       ((lastWeekCount - currentWeekCount) / lastWeekCount) *
//       100
//     ).toFixed(2)} %`;
//   }
//   return data;
// };

exports.dashboard = async (req, res) => {
  try {
    let data = {
      customers: 0,
      invoices: 0,
      estimates: 0,
      amountDue: 0,
      customerPercentage: {},
      quotationPercentage: {},
      invoicedPercentage: {},
      amountDuePercentage: {},
      invoiceList: [],
      series: [1, 0],
      labels: ["Paid", "Draft"],
      legend: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    const week = date.getStartAndEndDate("week");

    // Fetch customer data
    const customerRecords = await customerModel.aggregate([
      {
        $facet: {
          totalCustomersCount: [
            { $match: { isDeleted: false } },
            { $count: "count" },
          ],
          thisweek: [
            {
              $match: {
                createdAt: {
                  $gte: week.from_date,
                  $lte: week.to_date,
                },
              },
            },
            { $count: "count" },
          ],
          lastweek: [
            {
              $match: {
                createdAt: {
                  $gte: week.lastWeekFromDate,
                  $lte: week.lastWeekToDate,
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    // Fetch quotation data
    const quotationRecords = await quotationModel.aggregate([
      {
        $facet: {
          totalEstimationsCount: [
            {
              $match: {
                isDeleted: false,
              },
            },
            { $count: "count" },
          ],
          thisweek: [
            {
              $match: {
                isDeleted: false,
                createdAt: {
                  $gte: week.from_date,
                  $lte: week.to_date,
                },
              },
            },
            { $count: "count" },
          ],
          lastweek: [
            {
              $match: {
                isDeleted: false,
                createdAt: {
                  $gte: week.lastWeekFromDate,
                  $lte: week.lastWeekToDate,
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const lastWeekCustomerCount =
      customerRecords[0].lastweek.length > 0
        ? customerRecords[0].lastweek[0].count
        : 0;
    const currentWeekCustomerCount =
      customerRecords[0].thisweek.length > 0
        ? customerRecords[0].thisweek[0].count
        : 0;

    data.customerPercentage = this.PercentageCalculation(
      currentWeekCustomerCount,
      lastWeekCustomerCount
    );

    const lastWeekQuotationCount =
      quotationRecords[0].lastweek.length > 0
        ? quotationRecords[0].lastweek[0].count
        : 0;
    const currentWeekQuotationCount =
      quotationRecords[0].thisweek.length > 0
        ? quotationRecords[0].thisweek[0].count
        : 0;

    data.quotationPercentage = this.PercentageCalculation(
      currentWeekQuotationCount,
      lastWeekQuotationCount
    );

    // Fetch invoice percentages
    const invoicedPercentage = await this.invoicePercentageCalculation();
    data.invoicedPercentage = invoicedPercentage.invoiced;
    data.amountDuePercentage = invoicedPercentage.dueAmount;

    // Get total customers
    data.customers =
      customerRecords[0].totalCustomersCount.length > 0
        ? customerRecords[0].totalCustomersCount[0].count
        : 0;

    // Fetch invoices and process image URLs
    let invoiceRecords = await invoiceModel
      .find({ isDeleted: false, isSalesReturned: false })
      .populate("customerId")
      .sort({ _id: -1 })
      .lean();

    for (const invoice of invoiceRecords) {
      if (
        invoice.customerId &&
        invoice.customerId.image &&
        !invoice.customerId.image.startsWith("http")
      ) {
        invoice.customerId.image = `${process.env.DEVLOPMENT_BACKEND_URL}/${invoice.customerId.image}`;
      }
    }

    data.invoices = invoiceRecords;

    // Fetch total estimates
    data.estimates =
      quotationRecords[0].totalEstimationsCount.length > 0
        ? quotationRecords[0].totalEstimationsCount[0].count
        : 0;

    data.invoiceList = data.invoices;
    data.invoices = data.invoices.length;

    // Mark invoices as overdue if applicable
    for (const item of data.invoiceList) {
      if (
        item.dueDate < new Date() &&
        item.status !== "PAID" &&
        item.status !== "PARTIALLY_PAID" &&
        item.status !== "SENT"
      ) {
        item.status = "OVERDUE";
      }
    }

    data.invoiceList.splice(10);

    // Calculate various totals
    let paidRecs = 0;
    let draftRecs = 0;
    let overDueRecs = 0;
    let partiallyPaidRecs = 0;
    let invoiced = 0;
    let received = 0;
    let pending = 0;
    let draftedAmt = 0;
    let paidAmt = 0;
    let partiallyPaidAmt = 0;
    let overdueAmt = 0;

    // Fetch invoice data based on query type
    const { type } = req.query;
    let fromDate, toDate;

    const dates = date.getStartAndEndDate(type);
    let filter = {
      invoiceDate: {
        $gte: dates.from_date,
        $lte: dates.to_date,
      },
      isSalesReturned: false,
    };

    let invoiceRec = await invoiceModel.find(filter);
    let invoiceRecNo = invoiceRec.length;

    // Process invoices to calculate totals
    if (Array.isArray(invoiceRec)) {
      for (const item of invoiceRec) {
        if (item.isDeleted === false) {
          if (item.status === "PAID") {
            paidRecs += 1;
            received += parseFloat(item.TotalAmount);
            invoiced += parseFloat(item.TotalAmount);
            paidAmt += parseFloat(item.TotalAmount);
          } else if (item.status === "PARTIALLY_PAID") {
            partiallyPaidRecs += 1;
            const paymentRec = await paymentModel.aggregate([
              {
                $match: {
                  invoiceId: mongoose.Types.ObjectId(item._id),
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
            let paidAmount =
              paymentRec.length > 0 ? paymentRec[0].paidAmount : 0;
            pending += parseFloat(item.TotalAmount) - paidAmount;
            invoiced += parseFloat(item.TotalAmount);
            received += parseFloat(paidAmount);
            partiallyPaidAmt += paidAmount;
          } else if (
            item.dueDate < new Date() &&
            !["PAID", "PARTIALLY_PAID", "SENT"].includes(item.status)
          ) {
            overDueRecs += 1;
            pending += parseFloat(item.TotalAmount);
            invoiced += parseFloat(item.TotalAmount);
            overdueAmt += parseFloat(item.TotalAmount);
          } else {
            draftRecs += 1;
            pending += parseFloat(item.TotalAmount);
            invoiced += parseFloat(item.TotalAmount);
            draftedAmt += parseFloat(item.TotalAmount);
          }
        }
      }
    }

    data.series = [paidRecs, draftRecs, overDueRecs, partiallyPaidRecs];
    data.labels = ["PAID", "DRAFTED", "OVERDUE", "PARTIALLY PAID"];
    data.received = parseFloat(received);
    data.pending = parseFloat(pending);
    data.invoiced = parseFloat(invoiced);
    data.amountDue = parseFloat(overdueAmt) || 0;
    data.paidAmt = parseFloat(paidAmt);
    data.draftedAmt = parseFloat(draftedAmt);
    data.overdueAmt = parseFloat(overdueAmt);
    data.partiallyPaidAmt = parseFloat(partiallyPaidAmt);

    response.success_message(data, res);
  } catch (error) {
    console.log("error", error);
    response.error_message(error.message, res);
  }
};

exports.PercentageCalculation = (currentWeekCount, lastWeekCount) => {
  let data = {
    percentage: "",
    value: 0,
  };
  if (
    (!lastWeekCount && !currentWeekCount) ||
    lastWeekCount == currentWeekCount
  ) {
    data.percentage = "nil";
    data.value = "0 %";
  } else if (currentWeekCount && !lastWeekCount) {
    data.percentage = "Increased";
    data.value = "100 %";
  } else if (!currentWeekCount && lastWeekCount) {
    data.percentage = "Decreased";
    data.value = "100 %";
  } else if (currentWeekCount > lastWeekCount) {
    data.percentage = "Increased";
    data.value = `${(((currentWeekCount - lastWeekCount) / lastWeekCount) * 100).toFixed(2)} %`;
  } else if (currentWeekCount < lastWeekCount) {
    data.percentage = "Decreased";
    data.value = `${(((lastWeekCount - currentWeekCount) / lastWeekCount) * 100).toFixed(2)} %`;
  }
  return data;
};

exports.invoicePercentageCalculation = async () => {
  let data = {
    invoiced: {
      total: 0,
      paid: 0,
      drafted: 0,
      overdue: 0,
      partially_paid: 0,
    },
    dueAmount: {
      total: 0,
      paid: 0,
      drafted: 0,
      overdue: 0,
      partially_paid: 0,
    },
  };

  const invoices = await invoiceModel.find({
    isDeleted: false,
    isSalesReturned: false,
  });

  if (invoices && invoices.length > 0) {
    for (const invoice of invoices) {
      data.invoiced.total += 1;
      data.invoiced.paid += invoice.status === "PAID" ? 1 : 0;
      data.invoiced.drafted += invoice.status === "DRAFT" ? 1 : 0;
      data.invoiced.partially_paid += invoice.status === "PARTIALLY_PAID" ? 1 : 0;
      data.invoiced.overdue +=
        invoice.dueDate < new Date() &&
        invoice.status !== "PAID" &&
        invoice.status !== "PARTIALLY_PAID"
          ? 1
          : 0;

      data.dueAmount.total += parseFloat(invoice.TotalAmount) || 0;
      data.dueAmount.paid += invoice.status === "PAID" ? parseFloat(invoice.TotalAmount) || 0 : 0;
      data.dueAmount.drafted += invoice.status === "DRAFT" ? parseFloat(invoice.TotalAmount) || 0 : 0;
      data.dueAmount.partially_paid +=
        invoice.status === "PARTIALLY_PAID" ? parseFloat(invoice.TotalAmount) || 0 : 0;
      data.dueAmount.overdue +=
        invoice.dueDate < new Date() &&
        invoice.status !== "PAID" &&
        invoice.status !== "PARTIALLY_PAID"
          ? parseFloat(invoice.TotalAmount) || 0
          : 0;
    }
  }

  return {
    invoiced: {
      total: data.invoiced.total,
      paid: data.invoiced.paid,
      drafted: data.invoiced.drafted,
      overdue: data.invoiced.overdue,
      partially_paid: data.invoiced.partially_paid,
    },
    dueAmount: {
      total: data.dueAmount.total,
      paid: data.dueAmount.paid,
      drafted: data.dueAmount.drafted,
      overdue: data.dueAmount.overdue,
      partially_paid: data.dueAmount.partially_paid,
    },
  };
};

