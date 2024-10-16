/* eslint-disable react/prop-types */

import React from "react";
import Select2 from "react-select2-wrapper";

const SelectProducts = ({
  productData,
  canChange,
  Controller,
  errors,
  control,
  addTableRows,
  trigger,
}) => {
  return (
    <li>
      <Controller
        name="products"
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <Select2
              className={`form-control ${canChange} w-100 ${
                errors?.products ? "error-input" : ""
              }`}
              data={productData}
              options={{
                placeholder: "Select Product",
              }}
              value={value}
              type="number"
              onChange={(val) => {
                onChange(val);
                addTableRows(val.target.value);
                trigger("products");
              }}
            />
          </>
        )}
      />
      <small>{errors?.units?.message}</small>
    </li>
  );
};
export default SelectProducts;
