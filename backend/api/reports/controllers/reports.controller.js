const response = require("../../../response");
const customerModel = require("../../customers/models/customers.model");
const commonDate = require("../../common/date");
const invoiceModsalesModelel = require("../../invoice/models/invoice.model");
const verify = require("../../../verify.token");
const expenseModel = require("../../expense/models/expense.model");
const deliveryChallanModel = require("../../delivery_challans/models/delivery_challans.model");
const quotationModel = require("../../quotation/models/quotation.model");

exports.customer_report = async (req, res) => {
  try {
    let filter = {};
    if (
      req.query.start_date !== undefined &&
      req.query.end_date !== undefined
    ) {
      filter.created_at = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    } else {
      const dates = commonDate.getDateRange(req.query.days);
      filter.created_at = {
        $gte: dates.startDate,
        $lte: dates.endDate,
      };
    }
    const customerRec = await customerModel
      .find(filter)
      .populate("customer_id");
    response.success_message(customerRec, res);
  } catch (error) {
    response.error_message(error.messgae, res);
  }
};

// exports.sales_report = async (req, res) => {
//   try {
//     let filter = {};
//     if (
//       (req.query.start_date !== undefined && req, query.end_date !== undefined)
//     ) {
//       filter.created_at = {
//         $gte: new Date(req.query.start_date),
//         $lte: new Date(req.query.end_date),
//       };
//     } else {
//       const dates = commonDate.getDateRange(req.query.days);
//       filter.created_at = {
//         $gte: dates.startDate,
//         $lte: dates.endDate,
//       };
//     }

//     const salesRec = await salesModel.find(filter);
//     response.success_message(salesRec, res);
//   } catch (error) {
//     response.error_message(error.messgae, res);
//   }
// };

exports.balance_sheet_report = async (req, res) => {
  try {
    let filter = {};
    if (
      req.query.start_date !== undefined &&
      req.query.end_date !== undefined
    ) {
      filter.created_at = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    } else {
      const dates = commonDate.getDateRange(req.query.days);
      filter.created_at = {
        $gte: dates.startDate,
        $lte: dates.endDate,
      };
    }

    const salesRec = await salesModel.find(filter);
    response.success_message(salesRec, res);
  } catch (error) {
    response.error_message(error.messgae, res);
  }
};

exports.cash_flow_report = async (req, res) => {
  try {
    const auth_user = verify.verify_token(req.headers.token).details;

    let filter = {};
    let data = {};
    filter.user_id = auth_user.id;
    if (
      req.query.start_date !== undefined &&
      req.query.end_date !== undefined
    ) {
      filter.created_at = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    } else {
      const dates = commonDate.getDateRange(req.query.days);
      filter.created_at = {
        $gte: dates.startDate,
        $lte: dates.endDate,
      };
    }
    const incomeRec = await incomeModel.find({ user_id: auth_user.id });
    const expenseRec = await expenseModel.find({ user_id: auth_user.id });
    incomeRec.forEach((item) => {
      data.income = parseInt(item.amount);
    });
    expenseRec.forEach((item) => {
      data.expense = parseInt(item.amount);
    });
    data.netCashFlow = data.income - data.expense;
    response.success_message(data, res);
  } catch (error) {
    response.error_message(error.messgae, res);
  }
};

exports.delivery_challan_report = async (req, res) => {
  try {
    let filter = {};
    const auth_user = verify.verify_token(req.headers.token).details;
    if (req.body.start_date && req.body.end_date) {
      filter.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      filter = req.body;
    }
    filter.user_id = auth_user.id;

    const deliveryChallanRec = await deliveryChallanModel.find(filter);
    response.success_message(deliveryChallanRec, res);
  } catch (error) {
    response.error_message(error.messgae, res);
  }
};

//Quotation list
exports.quotation_report = function (req, res) {
  const auth_user = verify.verify_token(req.headers.token).details;
  var options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };
  options.select = "-__v -updated_at";

  var filter = {};
  if (req.query.id || req.query.number || req.query.date) filter = { $or: [] };
  if (req.query.id)
    filter.$or.push({
      quotation_id: { $regex: req.query.id, $options: "i" },
    });
  if (req.query.number)
    filter.$or.push({
      reference_no: { $regex: req.query.number, $options: "i" },
    });
  if (req.query.date)
    filter.$or.push({
      quotation_date: { $regex: req.query.date, $options: "i" },
    });
  filter.user_id = auth_user.id;

  quotationModel.paginate(filter, options).then((result) => {
    response.success_message_list(result, res);
  });
};

//filter quotation
exports.filterQuotation = async (req, res) => {
  try {
    let filter = {};
    if (req.query.customerName) {
      filter.customerName = req.query.customerName;
    }
    if (req.query.quotation_id) {
      filter.quotation_id = req.query.quotation_id;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.start_date && req.query.end_date) {
      filter.created_at = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    }
    const quotationRec = await quotationModel.find(filter);
    response.success_message(quotationRec, res);
  } catch (error) {
    response.error_message(error.message, res);
  }
};
