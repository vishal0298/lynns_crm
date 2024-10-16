import React from "react";
import { ViewinvoiceComponentController } from "./Viewinvoice.control";
import ViewInvoiceTemplate from "../viewInvoiceTemplate/ViewInvoiceTemplate";

const PrintinvoiceComponent = () => {
  return (
    <>
      <ViewinvoiceComponentController>
        <ViewInvoiceTemplate />
      </ViewinvoiceComponentController>
    </>
  );
};

export default PrintinvoiceComponent;
