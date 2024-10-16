const currencyModel = require("../../api/currency/models/currency.model");
const currencyJson = require("../../currencies.json");

exports.currencySeeder = async () => {
  try {
    const currencyRecords = await currencyModel.find().count();
    if (currencyRecords > 0) {
      return;
    } else {
      const importedRecords = currencyJson;
      await currencyModel.insertMany(importedRecords);
    }
  } catch (error) {
    console.log("error :", error);
  }
};
