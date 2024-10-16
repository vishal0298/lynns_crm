import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Invoiceone from "../templates/Invoiceone";
import InvoiceTwo from "../templates/InvoiceTwo";
import InvoiceThree from "../templates/InvoiceThree";
import InvoiceFour from "../templates/InvoiceFour";
import InvoiceFive from "../templates/InvoiceFive";
import { ViewinvoiceContext } from "../printDownload/Viewinvoice.control";

const ViewInvoiceTemplate = () => {
  const invoiceTemplate = useSelector((state) => state?.app?.invoiceTemplate);
  const { invoiceData } = useContext(ViewinvoiceContext);

  switch (invoiceTemplate) {
    case "1":
      return <Invoiceone data={invoiceData} />;
    case "2":
      return <InvoiceTwo data={invoiceData} />;
    case "3":
      return <InvoiceThree data={invoiceData} />;
    case "4":
      return <InvoiceFour data={invoiceData} />;
    case "5":
      return <InvoiceFive data={invoiceData} />;
    default:
      return <Invoiceone data={invoiceData} />;
  }
};

export default ViewInvoiceTemplate;
