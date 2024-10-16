import React from "react";
import { EditQuotationsComponentController } from "./editQuotation.control";
import EditQuotation from "./editQuotation";

const EditQuotationComponent = () => {
  return (
    <>
      <EditQuotationsComponentController>
        <EditQuotation />
      </EditQuotationsComponentController>
    </>
  );
};

export default EditQuotationComponent;
