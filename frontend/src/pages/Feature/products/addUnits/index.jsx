import React from "react";
import { AddUnitsComponentController } from "./addUnits.control";
import AddUnit from "./addUnits";

const AddUnitsComponent = () => {
  return (
    <>
      <AddUnitsComponentController>
        <AddUnit />
      </AddUnitsComponentController>
    </>
  );
};

export default AddUnitsComponent;
