import React from "react";
import { AddvendorComponentController } from "./addVendor.control";
import AddVendors from "./addVendors";

const AddvendorComponent = () => {
  return (
    <>
      <AddvendorComponentController>
        <AddVendors />
      </AddvendorComponentController>
    </>
  );
};

export default AddvendorComponent;
