import React from "react";
import { ViewinvoiceComponentController } from "./Viewinvoice.control";
import ViewInvoiceTemplate from "../viewInvoiceTemplate/ViewInvoiceTemplate";
import ViewInvoice from "../viewInvoice/Viewinvoice";

const ViewinvoiceComponent = () => {
  return (
    <>
      <ViewinvoiceComponentController>
        <ViewInvoice />
        {/* <ViewInvoiceTemplate /> */}
      </ViewinvoiceComponentController>
    </>
  );
};

export default ViewinvoiceComponent;
