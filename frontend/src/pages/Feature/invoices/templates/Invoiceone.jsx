/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import FeatherIcon from "feather-icons-react";
import { commonDatacontext } from "../../../../core/commonData";
import InvoiceOneprint from "./InvoiceOnePrinttable";
import { usePDF } from "react-to-pdf";
import { useSelector } from "react-redux";

const Invoiceone = ({ data }) => {
  const { companyData, currencyData } = useContext(commonDatacontext);
  const { invoiceLogo } = useSelector((state) => state.app);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <div className="main-wrapper">
        <div className="container">
          <div ref={targetRef}>
            <InvoiceOneprint
              data={data}
              companyData={companyData}
              currencyData={currencyData}
              invoiceLogo={invoiceLogo}
            />
          </div>
          <div className="file-link">
            <button
              className="download_btn download-link"
              onClick={handlePrint}
            >
              <FeatherIcon icon="printer" className="me-1" />
              <span>Print</span>
            </button>
            <button
              className="download_btn download-link"
              onClick={() => toPDF()}
            >
              <FeatherIcon icon="download-cloud" className="me-1" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoiceone;
