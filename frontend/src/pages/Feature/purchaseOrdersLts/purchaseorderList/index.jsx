import React from "react";
import ListPurchaseOrder from "./PoList";
import { ListpurchaseOrderController } from "./PoList.control";

const ListpurchaseOrder = () => {
  return (
    <>
      <ListpurchaseOrderController>
        <ListPurchaseOrder />
      </ListpurchaseOrderController>
    </>
  );
};

export default ListpurchaseOrder;
