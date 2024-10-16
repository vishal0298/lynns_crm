import React from "react";
import { EditExpenseComponentController } from "./EditExpense.control";
import EditExpense from "./EditExpense";

const EditChallanComponent = () => {
  return (
    <>
      <EditExpenseComponentController>
        <EditExpense />
      </EditExpenseComponentController>
    </>
  );
};

export default EditChallanComponent;
