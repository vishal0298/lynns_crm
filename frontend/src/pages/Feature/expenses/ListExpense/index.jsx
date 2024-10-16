import React from "react";
import { ListExpenseComponentController } from "./listExpense.control";
import ListExpense from "./listExpense";

const ListExpenseComponent = () => {
  return (
    <>
      <ListExpenseComponentController>
        <ListExpense />
      </ListExpenseComponentController>
    </>
  );
};

export default ListExpenseComponent;
