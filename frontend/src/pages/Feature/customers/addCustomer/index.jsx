import React from "react";
import { AddCustomerComponentController } from "./addCustomer.control";
import AddCustomers from "./addCustomer";

const AddQuotationComponent = () => {
  return (
    <>
      <AddCustomerComponentController>
        <AddCustomers />
      </AddCustomerComponentController>
    </>
  );
};

export default AddQuotationComponent;
