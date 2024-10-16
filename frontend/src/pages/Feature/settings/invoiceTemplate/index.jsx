import React from "react";
import InvoiceTemplate from "./invoiceTemplate";
import { InvoiceTemplateComponentController } from "./InvoiceTemplate.control";

const InvoiceTemplateComponent = () => {
  return (
    <>
      <InvoiceTemplateComponentController>
        <InvoiceTemplate />
      </InvoiceTemplateComponentController>
    </>
  );
};

export default InvoiceTemplateComponent;
