import React from "react";
import { AddExpenseComponentController } from "./AddExpense.control";
import AddExpense from "./AddExpense";

const AddChallanComponent = () => {
  return (
    <>
      <AddExpenseComponentController>
        <AddExpense />
      </AddExpenseComponentController>
    </>
  );
};

export default AddChallanComponent;
