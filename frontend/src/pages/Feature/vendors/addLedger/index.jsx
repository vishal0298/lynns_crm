import React from "react";
import AddLedger from "./addLedger";
import { AddLedgerComponentController } from "./addControl";

const AddledgerComponent = () => {
  return (
    <>
      <AddLedgerComponentController>
        <AddLedger />
      </AddLedgerComponentController>
    </>
  );
};

export default AddledgerComponent;
