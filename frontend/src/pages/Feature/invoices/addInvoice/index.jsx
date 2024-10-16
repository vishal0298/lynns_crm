import React from "react";
import AddInvoice from "./Addinvoice";
import { AddinvoiceComponentController } from "./Addinvoice.control";

const AddinvoiceComponent = () => {
  return (
    <>
      <AddinvoiceComponentController>
        <AddInvoice />
      </AddinvoiceComponentController>
    </>
  );
};

export default AddinvoiceComponent;
