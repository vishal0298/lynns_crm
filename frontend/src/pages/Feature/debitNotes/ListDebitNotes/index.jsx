import React from "react";
import { ListDebitNotesComponentController } from "./listDebitNotes.control";
import ListDebitNotes from "./listDebitNotes";

const ListDebitNotesComponent = () => {
  return (
    <>
      <ListDebitNotesComponentController>
        <ListDebitNotes />
      </ListDebitNotesComponentController>
    </>
  );
};

export default ListDebitNotesComponent;
