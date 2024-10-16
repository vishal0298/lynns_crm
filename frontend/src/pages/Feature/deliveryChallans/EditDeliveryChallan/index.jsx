import React from "react";
import { EditChallanComponentController } from "./EditChallan.control";
import EditChallan from "./EditChallan";

const EditChallanComponent = () => {
  return (
    <>
      <EditChallanComponentController>
        <EditChallan />
      </EditChallanComponentController>
    </>
  );
};

export default EditChallanComponent;
