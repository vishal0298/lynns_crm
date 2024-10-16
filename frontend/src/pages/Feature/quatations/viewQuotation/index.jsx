import React from "react";
import { ViewQuotationComponentController } from "./viewQuotation.control";
import ViewQuotations from "./viewQuotation";

const ViewQuotationComponent = () => {
  return (
    <>
      <ViewQuotationComponentController>
        <ViewQuotations />
      </ViewQuotationComponentController>
    </>
  );
};

export default ViewQuotationComponent;
