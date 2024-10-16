import React from "react";
import AddPurchaseOrder from "./AddpurchaseOrder";
import { AddpurchaseOrderComponentController } from "./AddpurchaseOrder.control";

const AddpurchaseOrderComponent = () => {
  return (
    <>
      <AddpurchaseOrderComponentController>
        <AddPurchaseOrder />
      </AddpurchaseOrderComponentController>
    </>
  );
};

export default AddpurchaseOrderComponent;
