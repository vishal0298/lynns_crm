import React from "react";
import { AddChallanComponentController } from "./AddChallan.control";
import AddChallan from "./AddChallan";

const AddChallanComponent = () => {
  return (
    <>
      <AddChallanComponentController>
        <AddChallan />
      </AddChallanComponentController>
    </>
  );
};

export default AddChallanComponent;
