import React from "react";
import { EditUnitsComponentController } from "./editUnits.control";
import EditUnits from "./editUnits";

const AddcategoryComponent = () => {
  return (
    <>
      <EditUnitsComponentController>
        <EditUnits />
      </EditUnitsComponentController>
    </>
  );
};

export default AddcategoryComponent;
