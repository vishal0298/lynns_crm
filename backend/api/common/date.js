const moment = require("moment");
exports.getStartAndEndDate = (type) => {
  const today = moment();
  const from_date = moment(today.startOf(type).toDate())
    .add(330, "minutes")
    .toDate();
  const to_date = moment(today.endOf(type).toDate())
    .add(330, "minutes")
    .toDate();
  const lastWeekFromDate = moment(
    today.subtract(1, "week").startOf(type).toDate()
  )
    .add(330, "minutes")
    .toDate();
  const lastWeekToDate = moment(today.endOf(type).toDate())
    .add(330, "minutes")
    .toDate();
  return { from_date, to_date, lastWeekFromDate, lastWeekToDate };
};

exports.getDateRange = (days) => {
  const endDate = new Date();
  endDate.setHours(29);
  endDate.setMinutes(30);
  endDate.setSeconds(0);
  const startDate = moment(new Date())
    .subtract(days - 1, "days")
    .toDate();
  startDate.setHours(5);
  startDate.setMinutes(30);
  startDate.setSeconds(0);
  return { startDate, endDate };
};

exports.resDate = (dat) => {
  return moment(dat, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").format("DD-MM-YYYY");
};

exports.calculateRenewalDates = (date, months) => {
  let renewalDates = [];
  let currentMonth = moment(date, "DD/MM/YYYY").toISOString();
  for (let index = months; index > 0; index--) {
    let addedDate = moment(currentMonth).add(1, "M").toISOString();
    renewalDates.push(moment(addedDate).format("DD-MM-YYYY"));
    currentMonth = addedDate;
  }
  return renewalDates;
};
