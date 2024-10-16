import React from "react";

import CreditNotes from "./CreditList";
import { ListCreditNotesController } from "./creditListControl";

const ListCreditNotes = () => {
  return (
    <>
      <ListCreditNotesController>
        <CreditNotes />
      </ListCreditNotesController>
    </>
  );
};

export default ListCreditNotes;
