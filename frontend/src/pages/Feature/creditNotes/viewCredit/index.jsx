import React from "react";
import ViewCredit from "./viewCredit";
import { ViewCreditNotesComponentController } from "./viewCreditControl";

const ViewCreditComponent = () => {
  return (
    <>
      <ViewCreditNotesComponentController>
        <ViewCredit />
      </ViewCreditNotesComponentController>
    </>
  );
};

export default ViewCreditComponent;
