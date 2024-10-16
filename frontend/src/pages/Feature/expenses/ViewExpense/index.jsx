import React from "react";
import { ViewExpenseComponentController } from "./ViewExpense.control";
import ViewExpense from "./ViewExpense";

const ViewexpenseComponent = () => {
  return (
    <>
      <ViewExpenseComponentController>
        <ViewExpense />
      </ViewExpenseComponentController>
    </>
  );
};

export default ViewexpenseComponent;
