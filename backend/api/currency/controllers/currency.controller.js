const response = require("../../../response");
const currencyModel = require("../models/currency.model");


exports.list = async function (req, res) {
  var filter = {};
  filter.country = req.query.country;
  if (req.query.country) filter.country_name = { $regex: req.query.country };

  const currencyRec = await currencyModel.find(filter);
  response.success_message(currencyRec, res);

};
