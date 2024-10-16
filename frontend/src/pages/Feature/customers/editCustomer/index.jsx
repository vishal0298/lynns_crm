import React from "react";
import { EditCustomerComponentController } from "./editCustomer.control";
import EditCustomer from "../EditCustomer";

const EditQuotationComponent = (props) => {
  return (
    <>
      <EditCustomerComponentController>
        <EditCustomer />
      </EditCustomerComponentController>
    </>
  );
};

export default EditQuotationComponent;
