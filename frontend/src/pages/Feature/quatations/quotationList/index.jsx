import React from "react";
import { ListQuotationsController } from "./listQuotation.control";
import QuotationList from "./listQuotation";

const ListpurchaseOrder = () => {
  return (
    <>
      <ListQuotationsController>
        <QuotationList />
      </ListQuotationsController>
    </>
  );
};

export default ListpurchaseOrder;
