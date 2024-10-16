import React from "react";
import EditPurchaseOrder from "./EditpurchaseOrder";
import { EditproductComponentController } from "./EditpurchaseOrder.control";

const EditpurchaseOrderComponent = () => {
  return (
    <>
      <EditproductComponentController>
        <EditPurchaseOrder />
      </EditproductComponentController>
    </>
  );
};

export default EditpurchaseOrderComponent;
