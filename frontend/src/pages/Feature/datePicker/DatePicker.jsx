import { DatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

const DatePickerComponent = ({ disabledDate, value, onChange }) => {
  return (
    <DatePicker
      className="datetimepicker form-control"
      picker="date"
      format="DD/MM/YYYY"
      placeholder="Select Date"
      onChange={(date) => {
        onChange(date ? dayjs(date) : null);
      }}
      value={value ? dayjs(value) : null}
      disabledDate={disabledDate}
    ></DatePicker>
  );
};

export default DatePickerComponent;
