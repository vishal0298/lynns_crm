import React from "react";

import { AddCreditNotesComponentController } from "./addCreditControl";
import AddCredit from "./addCredit";

const AddCreditNotesComponent = () => {
  return (
    <>
      <AddCreditNotesComponentController>
        <AddCredit />
      </AddCreditNotesComponentController>
    </>
  );
};

export default AddCreditNotesComponent;
