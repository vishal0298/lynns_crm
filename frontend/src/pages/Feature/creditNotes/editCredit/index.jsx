import React from "react";
import EditCredit from "./editCredit";
import { EditCreditComponentController } from "./editCreditControl";

const EditCreditNoteComponent = () => {
  return (
    <>
      <EditCreditComponentController>
        <EditCredit />
      </EditCreditComponentController>
    </>
  );
};

export default EditCreditNoteComponent;
