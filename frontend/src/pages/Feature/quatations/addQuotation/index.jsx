import React from "react";
import { AddQuotationsComponentController } from "./addQuotation.control";
import AddQuotation from "./addQuotation";

const AddQuotationComponent = () => {
  return (
    <>
      <AddQuotationsComponentController>
        <AddQuotation />
      </AddQuotationsComponentController>
    </>
  );
};

export default AddQuotationComponent;
