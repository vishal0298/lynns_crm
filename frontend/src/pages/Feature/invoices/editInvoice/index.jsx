import React from "react";
import EditInvoice from "./EditInvoice";
import { EditinvoiceComponentController } from "./EditInvoice.control";

const EditinvoiceComponent = () => {
  return (
    <>
      <EditinvoiceComponentController>
        <EditInvoice />
      </EditinvoiceComponentController>
    </>
  );
};

export default EditinvoiceComponent;
