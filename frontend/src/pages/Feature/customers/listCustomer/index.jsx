import React from "react";
import { ListCustomerController } from "./listCustomer.control";
import ListCustomer from "./listCustomer";

const ListpurchaseOrder = () => {
  return (
    <>
      <ListCustomerController>
        <ListCustomer />
      </ListCustomerController>
    </>
  );
};

export default ListpurchaseOrder;
